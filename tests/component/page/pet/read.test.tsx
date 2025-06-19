/** @jsxImportSource solid-js */

import { test, expect, describe } from 'vitest';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import nock from 'nock';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { formatHtml } from '../../../formatter';
import type { PetResponse } from '../../../../src/model/pet';
import Read from '../../../../src/component/page/pet/read';

describe('page - pet - read', () => {
  test('not found', async () => {
    nock('https://petstore.test').get('/api/pets/c9f4bea3-e706-4397-9560-01a0c0c52151').reply(404, {
      type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5',
      status: 404,
      title: 'Not Found',
      _httpError: 'NotFound',
      detail: 'There is no entry with id "c9f4bea3-e706-4397-9560-01a0c0c52151"',
    });

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/c9f4bea3-e706-4397-9560-01a0c0c52151', { scroll: false });
      });

      return (
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          {props.children}
        </QueryClientProvider>
      );
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet/:id" component={Read} />
      </Router>
    ));

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-read">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">Not Found</p>
            <p>There is no entry with id "c9f4bea3-e706-4397-9560-01a0c0c52151"</p>
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Read</h1>
          <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link="">List</a>
        </div>
      </div>"
    `);
  });

  test('success without vaccinations', async () => {
    const petResponse: PetResponse = {
      id: '89b3777b-1c36-493c-829d-6fe235e6af2c',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [],
      _links: {},
    };

    nock('https://petstore.test').get('/api/pets/89b3777b-1c36-493c-829d-6fe235e6af2c').reply(200, petResponse);

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/89b3777b-1c36-493c-829d-6fe235e6af2c', { scroll: false });
      });

      return (
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          {props.children}
        </QueryClientProvider>
      );
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet/:id" component={Read} />
      </Router>
    ));

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-read">
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Read</h1>
          <div>
            <dl>
              <dt class="font-bold">Id</dt>
              <dd class="mb-4">89b3777b-1c36-493c-829d-6fe235e6af2c</dd>
              <dt class="font-bold">CreatedAt</dt>
              <dd class="mb-4">15.08.2005 - 17:52:01</dd>
              <dt class="font-bold">UpdatedAt</dt>
              <dd class="mb-4">15.08.2005 - 17:55:01</dd>
              <dt class="font-bold">Name</dt>
              <dd class="mb-4">Brownie</dd>
              <dt class="font-bold">Tag</dt>
              <dd class="mb-4">0001-000</dd>
              <dt class="font-bold">Vaccinations</dt>
              <dd class="mb-4"></dd>
            </dl>
          </div>
          <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link="">List</a>
        </div>
      </div>"
    `);
  });

  test('success with vaccinations', async () => {
    const petResponse: PetResponse = {
      id: 'f1d9b1f7-1919-4d23-b471-89c7486ecb4a',
      createdAt: '2005-08-15T15:52:01+00:00',
      updatedAt: '2005-08-15T15:55:01+00:00',
      name: 'Brownie',
      tag: '0001-000',
      vaccinations: [{ name: 'Rabies' }],
      _links: {},
    };

    nock('https://petstore.test').get('/api/pets/f1d9b1f7-1919-4d23-b471-89c7486ecb4a').reply(200, petResponse);

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/f1d9b1f7-1919-4d23-b471-89c7486ecb4a', { scroll: false });
      });

      return (
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            })
          }
        >
          {props.children}
        </QueryClientProvider>
      );
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet/:id" component={Read} />
      </Router>
    ));

    await screen.findByTestId('page-pet-read');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div data-testid="page-pet-read">
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Read</h1>
          <div>
            <dl>
              <dt class="font-bold">Id</dt>
              <dd class="mb-4">f1d9b1f7-1919-4d23-b471-89c7486ecb4a</dd>
              <dt class="font-bold">CreatedAt</dt>
              <dd class="mb-4">15.08.2005 - 17:52:01</dd>
              <dt class="font-bold">UpdatedAt</dt>
              <dd class="mb-4">15.08.2005 - 17:55:01</dd>
              <dt class="font-bold">Name</dt>
              <dd class="mb-4">Brownie</dd>
              <dt class="font-bold">Tag</dt>
              <dd class="mb-4">0001-000</dd>
              <dt class="font-bold">Vaccinations</dt>
              <dd class="mb-4">
                <ul>
                  <li>Rabies</li>
                </ul>
              </dd>
            </dl>
          </div>
          <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link="">List</a>
        </div>
      </div>"
    `);
  });
});
