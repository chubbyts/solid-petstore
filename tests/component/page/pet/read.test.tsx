/** @jsxImportSource solid-js */

import Read from '../../../../src/component/page/pet/read';
import { vi, test, expect } from 'vitest';
import { formatHtml } from '../../../formatter';
import { NotFound } from '../../../../src/client/error';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import type { PetResponse } from '../../../../src/model/pet';
import type { ReadPet } from '../../../../src/client/pet';

let mockReadPet: typeof ReadPet;

vi.mock('../../../../src/client/pet', () => {
  return {
    ReadPet: (id: string) => {
      return mockReadPet(id);
    },
  };
});

test('not found', async () => {
  mockReadPet = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9', { scroll: false });
    });

    return <div>{props.children}</div>;
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
      <div>
        <div data-testid="page-pet-read">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">title</p>
          </div>
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Read</h1>
          <a
            colortheme="gray"
            href="/pet"
            class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link=""
            >List</a
          >
        </div>
      </div>
    </div>
    "
  `);
});

test('success', async () => {
  const petResponse: PetResponse = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    tag: '0001-000',
    vaccinations: [{ name: 'Rabies' }],
    _links: {},
  };

  mockReadPet = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9', { scroll: false });
    });

    return <div>{props.children}</div>;
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
      <div>
        <div data-testid="page-pet-read">
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Read</h1>
          <div>
            <dl>
              <dt class="font-bold">Id</dt>
              <dd class="mb-4">4d783b77-eb09-4603-b99b-f590b605eaa9</dd>
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
          <a
            colortheme="gray"
            href="/pet"
            class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link=""
            >List</a
          >
        </div>
      </div>
    </div>
    "
  `);
});
