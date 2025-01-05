import type { Component } from 'solid-js';
import { createEffect, Show, For, createMemo } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import qs from 'qs';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { z } from 'zod';
import type { PetFilters, PetListRequest, PetSort } from '../../../model/pet';
import { petFiltersSchema, petSortSchema } from '../../../model/pet';
import { deletePetClient as deleteClient, listPetsClient as listClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { H1 } from '../../heading';
import { Pagination } from '../../partial/pagination';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../table';
import { AnchorButton, Button } from '../../button';
import { PetFiltersForm } from '../../form/pet-filters-form';
import { numberSchema } from '../../../model/model';
import { createModelResource } from '../../../hook/create-model-resource';

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
  const getQuery = createMemo(() => querySchema.parse(qs.parse(location.search.substring(1))));

  const {
    getModelList: getPetList,
    getHttpError,
    actions,
  } = createModelResource({
    listClient,
    deleteClient,
  });

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
    actions.listModel(getPetListRequest());
  };

  const deletePet = async (id: string) => {
    if (await actions.deleteModel(id)) {
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
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;

    fetchPetList();
  });

  return (
    <Show when={getPetList() || getHttpError()}>
      <div data-testid="page-pet-list">
        <Show when={getHttpError()}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
        <H1>{pageTitle}</H1>
        <Show when={getPetList()}>
          {(getPetList) => (
            <div>
              <Show when={getPetList()._links?.create}>
                <AnchorButton href="/pet/create" colorTheme="green" class="mb-4">
                  Create
                </AnchorButton>
              </Show>
              <PetFiltersForm
                getHttpError={getHttpError}
                getInitialPetFilters={() => getQuery().filters}
                submitPetFilters={submitPetFilters}
              />
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
                  getCurrentPage={() => getQuery().page}
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
