import type { Component } from 'solid-js';
import { createEffect, onCleanup, createSignal, Show, For } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import qs from 'qs';
import type { PetFilters, PetListRequest, PetListResponse, PetSort } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient, listPetsClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { HttpError } from '../../../client/error';
import { H1 } from '../../heading';
import { format } from 'date-fns';
import { Pagination } from '../../partial/pagination';
import { de } from 'date-fns/locale';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { AnchorButton, Button } from '../../button';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { z } from 'zod';
import { numberSchema } from '../../../model/model';

const pageTitle = 'Pet List';

const limit = 10;

const querySchema = z.object({
  page: numberSchema.optional().default(1),
  filters: petFiltersSchema.optional().default({}),
  sort: petSortSchema.optional().default({}),
});

const PetListComponent: Component = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [getPetListOrUndefined, setPetListOrUndefined] = createSignal<PetListResponse>();
  const [getHttpErrorOrUndefined, setHttpErrorOrUndefined] = createSignal<HttpError>();

  const getQuery = () => querySchema.parse(qs.parse(location.search.substring(1)));

  const getPetListRequest = (): PetListRequest => {
    const query = getQuery();

    return {
      offset: query.page * limit - limit,
      limit,
      filters: query.filters,
      sort: query.sort,
    };
  };

  const fetchPetList = async () => {
    const response = await listPetsClient(getPetListRequest());

    if (response instanceof HttpError) {
      setHttpErrorOrUndefined(response);
    } else {
      setHttpErrorOrUndefined(undefined);
      setPetListOrUndefined(response);
    }
  };

  const deletePet = async (id: string) => {
    const deleteResponse = await deletePetClient(id);

    if (deleteResponse instanceof HttpError) {
      setHttpErrorOrUndefined(deleteResponse);
    } else {
      setHttpErrorOrUndefined(undefined);
      fetchPetList();
    }
  };

  const submitPage = (page: number): void => {
    const query = getQuery();

    navigate(`/pet?${qs.stringify({ ...query, page })}`);
  };

  const submitPetFilters = (filters: PetFilters): void => {
    const query = getQuery();

    navigate(`/pet?${qs.stringify({ ...query, page: 1, filters })}`);
  };

  const submitPetSort = (sort: PetSort): void => {
    const query = getQuery();

    navigate(`/pet?${qs.stringify({ ...query, page: 1, sort })}`);
  };

  createEffect(() => {
    document.title = pageTitle;

    fetchPetList();
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <Show when={getPetListOrUndefined() || getHttpErrorOrUndefined()}>
      <div data-testid="page-pet-list">
        <Show when={getHttpErrorOrUndefined()}>
          {(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}
        </Show>
        <H1>{pageTitle}</H1>
        <Show when={getPetListOrUndefined()}>
          {(getPetList) => (
            <div>
              <Show when={getPetList()._links?.create}>
                <AnchorButton href="/pet/create" colorTheme="green">
                  Create
                </AnchorButton>
              </Show>
              <div class="mt-4">
                <PetFiltersForm
                  getHttpErrorOrUndefined={getHttpErrorOrUndefined}
                  getInitialPetFilters={() => getQuery().filters}
                  submitPetFilters={submitPetFilters}
                />
              </div>
              <div class="mt-4">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Id</Th>
                      <Th>CreatedAt</Th>
                      <Th>UpdatedAt</Th>
                      <Th>
                        <span>Name (</span>
                        <button
                          data-testid="pet-sort-name-asc"
                          onClick={() => submitPetSort({ ...getQuery().sort, name: 'asc' })}
                        >
                          <span class="mx-1 inline-block">A-Z</span>
                        </button>
                        <span>|</span>
                        <button
                          data-testid="pet-sort-name-desc"
                          onClick={() => submitPetSort({ ...getQuery().sort, name: 'desc' })}
                        >
                          <span class="mx-1 inline-block">Z-A</span>
                        </button>
                        <span>|</span>
                        <button
                          data-testid="pet-sort-name--"
                          onClick={() => submitPetSort({ ...getQuery().sort, name: undefined })}
                        >
                          <span class="mx-1 inline-block">---</span>
                        </button>
                        <span>)</span>
                      </Th>
                      <Th>Tag</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <For each={getPetList().items}>
                      {(pet, getId) => (
                        <Tr data-testid={`pet-list-${getId()}`}>
                          <Td>{pet.id}</Td>
                          <Td>{format(Date.parse(pet.createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</Td>
                          <Td>
                            {pet.updatedAt &&
                              format(Date.parse(pet.updatedAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                          </Td>
                          <Td>{pet.name}</Td>
                          <Td>{pet.tag}</Td>
                          <Td>
                            <Show when={pet._links?.read}>
                              <AnchorButton href={`/pet/${pet.id}`} colorTheme="gray" class="mr-4">
                                Read
                              </AnchorButton>
                            </Show>
                            <Show when={pet._links?.update}>
                              <AnchorButton href={`/pet/${pet.id}/update`} colorTheme="gray" class="mr-4">
                                Update
                              </AnchorButton>
                            </Show>
                            <Show when={pet._links?.delete}>
                              <Button
                                data-testid={`remove-pet-${getId()}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();

                                  deletePet(pet.id);
                                }}
                                colorTheme="red"
                              >
                                Delete
                              </Button>
                            </Show>
                          </Td>
                        </Tr>
                      )}
                    </For>
                  </Tbody>
                </Table>
              </div>
              <div class="mt-4">
                <Pagination
                  getPage={() => getQuery().page}
                  getTotalPages={() => Math.ceil(getPetList().count / limit)}
                  getMaxPages={() => 7}
                  submitPage={submitPage}
                />
              </div>
            </div>
          )}
        </Show>
      </div>
    </Show>
  );
};

export default PetListComponent;
