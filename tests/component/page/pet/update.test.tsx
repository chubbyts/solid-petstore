/** @jsxImportSource solid-js */

import Update from '../../../../src/component/page/pet/update';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import { vi, test, expect } from 'vitest';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import { formatHtml } from '../../../formatter';
import { NetworkError, NotFound, UnprocessableEntity } from '../../../../src/client/error';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import type { readPetClient, updatePetClient } from '../../../../src/client/pet';
import { userEvent } from '@testing-library/user-event';

let mockReadPetClient: typeof readPetClient;
let mockUpdatePetClient: typeof updatePetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    readPetClient: (id: string) => {
      return mockReadPetClient(id);
    },
    updatePetClient: (id: string, pet: PetRequest) => {
      return mockUpdatePetClient(id, pet);
    },
  };
});

vi.mock('../../../../src/component/form/pet-form', () => {
  return {
    PetForm: (props: PetFormProps) => {
      const onSubmit = () => {
        props.submitPet({ name: 'Brownie', vaccinations: [] });
      };

      return (
        <button
          data-testid="pet-form-submit"
          data-has-http-error={!!props.getHttpError()}
          data-has-initial-pet={!!props.getInitialPet()}
          onClick={onSubmit}
        />
      );
    },
  };
});

test('not found', async () => {
  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<NotFound>((resolve) => resolve(new NotFound({ title: 'title' })));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet/:id/update" component={Update} />
    </Router>
  ));

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-update">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">title</p>
          </div>
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
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

test('default', async () => {
  const petResponse: PetResponse = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    tag: '0001-000',
    vaccinations: [{ name: 'Rabies' }],
    _links: {},
  };

  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet/:id/update" component={Update} />
    </Router>
  ));

  await screen.findByTestId('page-pet-update');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-update">
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="false"
            data-has-initial-pet="true"
          ></button
          ><a
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

test('network error', async () => {
  const petResponse: PetResponse = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    tag: '0001-000',
    vaccinations: [{ name: 'Rabies' }],
    _links: {},
  };

  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  mockUpdatePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<NetworkError>((resolve) => resolve(new NetworkError({ title: 'network error' })));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet/:id/update" component={Update} />
    </Router>
  ));

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('http-error');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-update">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">network error</p>
          </div>
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="true"
            data-has-initial-pet="true"
          ></button
          ><a
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

test('unprocessable entity', async () => {
  const petResponse: PetResponse = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    name: 'Brownie',
    tag: '0001-000',
    vaccinations: [{ name: 'Rabies' }],
    _links: {},
  };

  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  mockUpdatePetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<UnprocessableEntity>((resolve) =>
      resolve(new UnprocessableEntity({ title: 'unprocessable entity' })),
    );
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet/:id/update" component={Update} />
    </Router>
  ));

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('http-error');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-update">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">unprocessable entity</p>
          </div>
          <h1 class="mb-4 border-b pb-2 text-4xl font-black">Pet Update</h1>
          <button
            data-testid="pet-form-submit"
            data-has-http-error="true"
            data-has-initial-pet="true"
          ></button
          ><a
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

test('successful', async () => {
  const petRequest: PetRequest = {
    name: 'Brownie',
    tag: '0001-000',
    vaccinations: [{ name: 'Rabies' }],
  };

  const petResponse: PetResponse = {
    id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
    createdAt: '2005-08-15T15:52:01+00:00',
    updatedAt: '2005-08-15T15:55:01+00:00',
    ...petRequest,
    _links: {},
  };

  mockReadPetClient = async (id: string) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  mockUpdatePetClient = async (id: string, petRequest: PetRequest) => {
    expect(id).toBe('4d783b77-eb09-4603-b99b-f590b605eaa9');

    expect(petRequest).toEqual(petRequest);

    return new Promise<PetResponse>((resolve) => resolve(petResponse));
  };

  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Route path="/" component={() => <div />} />
      <Route path="/pet" component={() => <div data-testid="page-pet-list" />} />
      <Route path="/pet/:id/update" component={Update} />
    </Router>
  ));

  const testButton = await screen.findByTestId('pet-form-submit');

  await userEvent.click(testButton);

  await screen.findByTestId('page-pet-list');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-pet-list"></div></div>
    </div>
    "
  `);
});
