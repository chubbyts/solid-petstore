import type { Component } from 'solid-js';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { A, useLocation, useNavigate } from '@solidjs/router';
import qs from 'qs';
import { z } from 'zod';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/solid-query';
import { Loading } from '../../partial/loading';
import { DeleteDialog } from '../../partial/delete-dialog';
import { Pagination } from '../../partial/pagination';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { PageHeader } from '../../heading';
import { AnchorButton, Button } from '../../button';
import { Card } from '../../card';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '../../icon';
import { numberSchema } from '../../../model/model';
import type { PetFilters, PetListRequest, PetListResponse, PetResponse, PetSort } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideDeleteMutationFn, provideListQueryFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { DateTime } from '../../date-time';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Pets';

const limit = 10;

const visibleVaccinations = 2;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

// Default → Name A–Z → Name Z–A → Default
const nextSortName = (name: PetSort['name']): PetSort['name'] => {
  if (name === 'asc') {
    return 'desc';
  }

  if (name === 'desc') {
    return undefined;
  }

  return 'asc';
};

const PetList: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getQuery = createMemo(() => querySchema.parse(qs.parse(location.search.substring(1))));
  const queryClient = useQueryClient();
  const showToast = useToast();

  const [getPetToDelete, setPetToDelete] = createSignal<PetResponse | undefined>(undefined);

  // a delete finishing late (dialog cancelled meanwhile) must not close the dialog opened for another pet
  const closeDeleteDialogOf = (pet: PetResponse): void => {
    setPetToDelete((current) => (current?.id === pet.id ? undefined : current));
  };

  const getPetListRequest = (): PetListRequest => {
    const query = getQuery();

    return {
      offset: query.page * limit - limit,
      limit,
      filters: query.filters,
      sort: query.sort,
    };
  };

  const petListQuery = useQuery<PetListResponse, HttpError>(() => ({
    queryKey: ['pets', qs.stringify(getPetListRequest())],
    queryFn: provideListQueryFn(listPetsClient, getPetListRequest()),
    // keep showing the current page while the next one loads: no flicker and the pagination keeps the focus
    placeholderData: keepPreviousData,
    retry: false,
  }));

  const petDeleteMutation = useMutation<unknown, HttpError, PetResponse>(() => ({
    mutationFn: (pet: PetResponse) => provideDeleteMutationFn(deletePetClient)(pet.id),
    // closes the dialog once the list is refetched: the row (and its delete button) is gone by then,
    // so the dialog moves the focus to the main content instead of an element about to be removed
    onSuccess: async (_, pet) => {
      await queryClient.invalidateQueries({ queryKey: ['pets'] });
      closeDeleteDialogOf(pet);
      showToast(`Deleted “${pet.name}” — 204 No Content`);
    },
    onError: (_, pet) => {
      closeDeleteDialogOf(pet);
    },
    retry: false,
  }));

  // refining a filter (e.g. "re" → "rex" while typing) replaces the history entry: back returns to the list
  // before the filtering, not keystroke by keystroke
  const submitPetFilters = (filters: PetFilters): void => {
    const query = getQuery();

    navigate(`/pet?${qs.stringify({ ...query, page: 1, filters })}`, {
      replace: Boolean(query.filters.name && filters.name),
    });
  };

  const submitPetSort = (sort: PetSort): void => {
    navigate(`/pet?${qs.stringify({ ...getQuery(), page: 1, sort })}`);
  };

  const toggleSort = (): void => {
    const query = getQuery();

    submitPetSort({ ...query.sort, name: nextSortName(query.sort.name) });
  };

  // past the last page (e.g. its last pet got deleted, or an outdated link): go to the last page
  // not from placeholder data: that's the response of another query (e.g. other filters, after back)
  // the limit of the response: the server may cap the requested one, like the pagination does
  const getLastPage = (): number | undefined =>
    petListQuery.data && !petListQuery.isPlaceholderData
      ? Math.max(1, Math.ceil(petListQuery.data.count / petListQuery.data.limit))
      : undefined;

  createEffect(() => {
    const lastPage = getLastPage();
    const query = getQuery();

    if (lastPage !== undefined && query.page > lastPage) {
      navigate(`/pet?${qs.stringify({ ...query, page: lastPage })}`, { replace: true });
    }
  });

  useDocumentTitle(() => pageTitle);
  usePageError(
    () => petDeleteMutation.error ?? petListQuery.error,
    () => Boolean(petDeleteMutation.error),
  );

  // a page past the end (also as placeholder while the last page loads) has nothing to show: no bogus range
  const getData = (): PetListResponse | undefined => {
    const data = petListQuery.data;

    return data && !(data.count > 0 && data.offset >= data.count) ? data : undefined;
  };

  return (
    <Show when={!petListQuery.isLoading} fallback={<Loading />}>
      <div data-testid="page-pet-list" class="flex flex-col gap-[22px]">
        <PageHeader
          eyebrow="Resources / Pets"
          title={pageTitle}
          action={
            <Show when={petListQuery.data?._links?.create}>
              <AnchorButton data-testid="pet-create" href="/pet/create" variant="primary">
                <PlusIcon strokeWidth={2.2} />
                New pet
              </AnchorButton>
            </Show>
          }
        />
        <Card aria-label="Pet list" aria-busy={petListQuery.isFetching || undefined} class="overflow-hidden">
          {/* outside the data check: stays (with the typing and its focus) if the filter gets rejected */}
          <div class="border-line flex flex-wrap items-center gap-3 border-b px-4 py-3.5">
            <PetFiltersForm
              getHttpError={() => petListQuery.error ?? undefined}
              getInitialPetFilters={() => getQuery().filters}
              submitPetFilters={submitPetFilters}
            />
          </div>
          <Show when={getData()}>
            {(getPetList) => (
              <>
                <Table stackOnNarrow class="min-w-[1120px]">
                  <caption class="sr-only">Pets</caption>
                  <Thead>
                    <Tr>
                      <Th onSort={toggleSort} sort={getQuery().sort.name ?? undefined}>
                        Name
                      </Th>
                      <Th>Tag</Th>
                      <Th>Vaccinations</Th>
                      <Th shrink>ID</Th>
                      <Th shrink>Created</Th>
                      <Th shrink>Updated</Th>
                      <Th align="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <For each={getPetList().items}>
                      {(pet, getIndex) => (
                        <Tr>
                          <Td>
                            <Show when={pet._links?.read} fallback={<span class="font-semibold">{pet.name}</span>}>
                              <A
                                href={`/pet/${pet.id}`}
                                class="text-fg hover:text-link font-semibold no-underline hover:underline"
                              >
                                {pet.name}
                              </A>
                            </Show>
                          </Td>
                          <Td label="Tag">
                            <Show when={pet.tag}>
                              <span class="bg-line text-fg-secondary inline-block rounded-full px-2 py-0.5 text-[13px] font-medium">
                                {pet.tag}
                              </span>
                            </Show>
                          </Td>
                          <Td label="Vaccinations">
                            <Show when={pet.vaccinations.length > 0}>
                              <div class="flex flex-wrap items-center gap-1.5">
                                <For each={pet.vaccinations.slice(0, visibleVaccinations)}>
                                  {(vaccination) => (
                                    <span class="border-chip-line bg-chip text-chip-fg rounded-md border px-2 py-0.5 text-[13px]">
                                      {vaccination.name}
                                    </span>
                                  )}
                                </For>
                                <Show when={pet.vaccinations.length > visibleVaccinations}>
                                  <span class="text-fg-muted text-[13px]">
                                    <span aria-hidden="true">+{pet.vaccinations.length - visibleVaccinations}</span>
                                    <span class="sr-only">
                                      and {pet.vaccinations.length - visibleVaccinations} more
                                    </span>
                                  </span>
                                </Show>
                              </div>
                            </Show>
                          </Td>
                          <Td label="ID" nowrap class="text-fg-placeholder text-[13px]">
                            {pet.id}
                          </Td>
                          <Td label="Created" nowrap class="text-fg-placeholder text-[13px]">
                            <DateTime value={pet.createdAt} />
                          </Td>
                          <Td label="Updated" nowrap class="text-fg-placeholder text-[13px]">
                            <Show when={pet.updatedAt}>{(getUpdatedAt) => <DateTime value={getUpdatedAt()} />}</Show>
                          </Td>
                          {/* stacked: the text of the first action aligned with the labels */}
                          <Td align="right" compact nowrap class="@max-3xl:-ml-3">
                            <Show when={pet._links?.read}>
                              <AnchorButton
                                data-testid={`read-pet-${getIndex()}`}
                                href={`/pet/${pet.id}`}
                                variant="ghost"
                                size="sm"
                                aria-label={`View ${pet.name}`}
                              >
                                <EyeIcon />
                                View
                              </AnchorButton>
                            </Show>
                            <Show when={pet._links?.update}>
                              <AnchorButton
                                data-testid={`update-pet-${getIndex()}`}
                                href={`/pet/${pet.id}/update`}
                                variant="ghost"
                                size="sm"
                                aria-label={`Edit ${pet.name}`}
                              >
                                <PencilIcon />
                                Edit
                              </AnchorButton>
                            </Show>
                            <Show when={pet._links?.delete}>
                              <Button
                                data-testid={`remove-pet-${getIndex()}`}
                                variant="ghost-danger"
                                size="sm"
                                aria-label={`Delete ${pet.name}`}
                                onClick={() => setPetToDelete(pet)}
                              >
                                <TrashIcon />
                                Delete
                              </Button>
                            </Show>
                          </Td>
                        </Tr>
                      )}
                    </For>
                  </Tbody>
                </Table>
                <Show when={getPetList().items.length === 0}>
                  <div class="text-fg-muted flex flex-col items-center gap-2.5 px-4 py-12">
                    <Show when={getQuery().filters.name} fallback={<strong class="text-fg">No pets yet</strong>}>
                      {(getName) => (
                        <>
                          <strong class="text-fg">No pets match “{getName()}”</strong>
                          <Button
                            data-testid="pet-filters-clear"
                            variant="secondary"
                            size="sm"
                            onClick={() => submitPetFilters({ ...getQuery().filters, name: undefined })}
                          >
                            Clear filter
                          </Button>
                        </>
                      )}
                    </Show>
                  </div>
                </Show>
                <Pagination
                  getOffset={() => getPetList().offset}
                  getLimit={() => getPetList().limit}
                  getCount={() => getPetList().count}
                  pageHref={(page) => `/pet?${qs.stringify({ ...getQuery(), page })}`}
                />
              </>
            )}
          </Show>
        </Card>
        <Show when={getPetToDelete()}>
          {(getPet) => (
            <DeleteDialog
              name={getPet().name}
              getIsPending={() => petDeleteMutation.isPending}
              onCancel={() => setPetToDelete(undefined)}
              onConfirm={() => petDeleteMutation.mutate(getPet())}
            />
          )}
        </Show>
      </div>
    </Show>
  );
};

export default PetList;
