/** @jsxImportSource solid-js */

import List from '../../../../src/component/page/pet/list';
import type { PetFiltersFormProps } from '../../../../src/component/form/pet-filters-form';
import { vi, test, expect } from 'vitest';
import type { PetListRequest, PetListResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import type { deletePetClient, listPetsClient } from '../../../../src/client/pet';
import type { PaginationProps } from '../../../../src/component/partial/pagination';
import { NetworkError } from '../../../../src/client/error';
import { userEvent } from '@testing-library/user-event';

let mockDeletePetClient: typeof deletePetClient;
let mockListPetsClient: typeof listPetsClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    deletePetClient: (id: string) => {
      return mockDeletePetClient(id);
    },
    listPetsClient: (petListRequest: PetListRequest) => {
      return mockListPetsClient(petListRequest);
    },
  };
});

vi.mock('../../../../src/component/form/pet-filters-form', () => {
  return {
    PetFiltersForm: (props: PetFiltersFormProps) => {
      const onClick = () => {
        props.submitPetFilters({ name: 'Brownie' });
      };

      return (
        <button
          data-testid="pet-filters-form-submit"
          data-has-http-error={!!props.getHttpErrorOrUndefined()}
          data-has-initial-pet-filters={!!props.getInitialPetFilters()}
          onClick={onClick}
        />
      );
    },
  };
});

vi.mock('../../../../src/component/partial/pagination', () => {
  return {
    Pagination: (props: PaginationProps) => {
      const onClick = () => {
        props.submitPage(2);
      };

      return (
        <button
          data-testid="pagination-next"
          data-current-page={props.getPage()}
          data-total-pages={props.getTotalPages()}
          data-max-pages={props.getMaxPages()}
          onClick={onClick}
        />
      );
    },
  };
});

test('network error', async () => {
  mockListPetsClient = async () => {
    return Promise.resolve(new NetworkError({ title: 'network error' }));
  };

  mockDeletePetClient = async () => undefined;

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={List} />
    </Router>
  ));

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-list">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">network error</p>
          </div>
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet List</h1>
        </div>
      </div>
    </div>
    "
  `);
});

test('default', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return {
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
          },
        },
      ],
      _links: {
        create: { href: '/api/pets' },
      },
    };
  };

  mockDeletePetClient = async () => undefined;

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={List} />
    </Router>
  ));

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-list">
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet List</h1>
          <div>
            <a
              colortheme="green"
              href="/pet/create"
              class="inline-block px-5 py-2 text-white bg-green-600 hover:bg-green-700 inactive"
              link=""
              >Create</a
            >
            <div class="mt-4">
              <button
                data-testid="pet-filters-form-submit"
                data-has-http-error="false"
                data-has-initial-pet-filters="true"
              ></button>
            </div>
            <div class="mt-4">
              <div class="block w-full md:table">
                <div class="block w-full md:table-header-group">
                  <div class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row">
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Id
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      CreatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      UpdatedAt
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      <span>Name (</span
                      ><button data-testid="pet-sort-name-asc">
                        <span class="mx-1 inline-block">A-Z</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name-desc">
                        <span class="mx-1 inline-block">Z-A</span></button
                      ><span>|</span
                      ><button data-testid="pet-sort-name--">
                        <span class="mx-1 inline-block">---</span></button
                      ><span>)</span>
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Tag
                    </div>
                    <div
                      class="block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r"
                    >
                      Actions
                    </div>
                  </div>
                </div>
                <div class="block w-full md:table-row-group">
                  <div
                    data-testid="pet-list-0"
                    class="mb-5 block even:bg-gray-100 md:mt-0 md:table-row"
                  >
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      4d783b77-eb09-4603-b99b-f590b605eaa9
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      15.08.2005 - 17:52:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      15.08.2005 - 17:55:01
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      Brownie
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      0001-000
                    </div>
                    <div
                      class="block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r"
                    >
                      <a
                        colortheme="gray"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9"
                        class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4 inactive"
                        link=""
                        >Read</a
                      ><a
                        colortheme="gray"
                        href="/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update"
                        class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 mr-4 inactive"
                        link=""
                        >Update</a
                      ><button
                        data-testid="remove-pet-0"
                        colortheme="red"
                        class="inline-block px-5 py-2 text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <button
                data-testid="pagination-next"
                data-current-page="1"
                data-total-pages="1"
                data-max-pages="7"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    "
  `);
});

test('delete error', async () => {
  mockListPetsClient = async (petListRequest: PetListRequest) => {
    expect(petListRequest).toEqual({
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
    });

    return {
      offset: 0,
      limit: 10,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2005-08-15T15:52:01+00:00',
          updatedAt: '2005-08-15T15:55:01+00:00',
          name: 'Brownie',
          tag: '0001-000',
          vaccinations: [{ name: 'Rabies' }],
          _links: {
            read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
          },
        },
      ],
      _links: {
        create: { href: '/api/pets' },
      },
    };
  };

  mockDeletePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new NetworkError({ title: 'network error' });
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={List} />
    </Router>
  ));

  await screen.findByTestId('page-pet-list');

  const removeButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removeButton);

  await screen.findByTestId('http-error');

  expect(formatHtml((await screen.findByTestId('http-error')).outerHTML)).toMatchInlineSnapshot(`
    "<div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
      <p class="font-bold">network error</p>
    </div>
    "
  `);
});

test('delete success', async () => {
  const petListCalls: Array<{ parameters: [PetListRequest]; return: Promise<PetListResponse> }> = [
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
  ];

  mockListPetsClient = async (petListRequest: PetListRequest) => {
    const petListCall = petListCalls.shift();
    if (!petListCall) {
      throw new Error('Missing call');
    }

    expect(petListRequest).toEqual(petListCall.parameters[0]);

    return petListCall.return;
  };

  mockDeletePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return undefined;
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={List} />
    </Router>
  ));

  await screen.findByTestId('page-pet-list');

  const removeButton = await screen.findByTestId('remove-pet-0');

  await userEvent.click(removeButton);
});

test('submit', async () => {
  const petListCalls: Array<{ parameters: [PetListRequest]; return: Promise<PetListResponse> }> = [
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: {},
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Brownie',
            tag: '0001-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: {},
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: {},
        sort: { name: 'desc' },
        count: 1,
        items: [
          {
            id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
            createdAt: '2005-08-15T15:52:01+00:00',
            updatedAt: '2005-08-15T15:55:01+00:00',
            name: 'Blacky',
            tag: '0002-000',
            vaccinations: [{ name: 'Rabies' }],
            _links: {
              read: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              update: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
              delete: { href: '/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9' },
            },
          },
        ],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 0,
          limit: 10,
          filters: { name: 'Brownie' },
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 0,
        limit: 10,
        filters: { name: 'Brownie' },
        sort: { name: 'desc' },
        count: 0,
        items: [],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
    {
      parameters: [
        {
          offset: 10,
          limit: 10,
          filters: { name: 'Brownie' },
          sort: { name: 'desc' },
        },
      ],
      return: Promise.resolve({
        offset: 10,
        limit: 10,
        filters: { name: 'Brownie' },
        sort: { name: 'desc' },
        count: 0,
        items: [],
        _links: {
          create: { href: '/api/pets' },
        },
      }),
    },
  ];

  mockListPetsClient = async (petListRequest: PetListRequest) => {
    const petListCall = petListCalls.shift();
    if (!petListCall) {
      throw new Error('Missing call');
    }

    expect(petListRequest).toEqual(petListCall.parameters[0]);

    return petListCall.return;
  };

  mockDeletePetClient = async () => undefined;

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={List} />
    </Router>
  ));

  await screen.findByTestId('page-pet-list');

  const petSortNameSubmitButton = await screen.findByTestId('pet-sort-name-desc');

  await userEvent.click(petSortNameSubmitButton);

  await screen.findByTestId('page-pet-list');

  const petFiltersFormSubmitButton = await screen.findByTestId('pet-filters-form-submit');

  await userEvent.click(petFiltersFormSubmitButton);

  await screen.findByTestId('page-pet-list');

  const paginationNextButton = await screen.findByTestId('pagination-next');

  await userEvent.click(paginationNextButton);
});
