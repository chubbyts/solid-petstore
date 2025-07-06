/** @jsxImportSource solid-js */

import { userEvent } from '@testing-library/user-event';
import { vi, test, expect, describe } from 'vitest';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import { UnprocessableEntity } from '../../../../src/client/error';
import { formatHtml } from '../../../formatter';
import type { PetRequest, PetResponse } from '../../../../src/model/pet';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import Create from '../../../../src/component/page/pet/create';
import type { createPetClient } from '../../../../src/client/pet';

// eslint-disable-next-line functional/no-let
let mockCreatePetClient: typeof createPetClient;

vi.mock('../../../../src/client/pet', () => {
  return {
    // eslint-disable-next-line functional/prefer-tacit
    createPetClient: (pet: PetRequest) => {
      return mockCreatePetClient(pet);
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

describe('create', () => {
  test('default', async () => {
    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
      });

      return <div>{props.children}</div>;
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    await screen.findByTestId('page-pet-create');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-create">
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Create</h1>
          <button data-testid="pet-form-submit" data-has-http-error="false" data-has-initial-pet="false"></button>
          <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link="">List</a>
        </div>
      </div>
    </div>"
  `);
  });

  test('unprocessable entity', async () => {
    mockCreatePetClient = async (_: PetRequest) => {
      return new Promise<UnprocessableEntity>((resolve) =>
        resolve(new UnprocessableEntity({ title: 'unprocessable entity' })),
      );
    };

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
      });

      return <div>{props.children}</div>;
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-create">
          <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
            <p class="font-bold">unprocessable entity</p>
          </div>
          <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Create</h1>
          <button data-testid="pet-form-submit" data-has-http-error="true" data-has-initial-pet="false"></button>
          <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
            link="">List</a>
        </div>
      </div>
    </div>"
  `);
  });

  test('successful', async () => {
    mockCreatePetClient = async (petRequest: PetRequest) => {
      const petResponse: PetResponse = {
        id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
        createdAt: '2005-08-15T15:52:01+00:00',
        ...petRequest,
        _links: {},
      };
      return new Promise<PetResponse>((resolve) => resolve(petResponse));
    };

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
      });

      return <div>{props.children}</div>;
    };

    const { container } = render(() => (
      <Router root={App}>
        <Route path="/" component={() => <div />} />
        <Route path="/pet" component={() => <div data-testid="page-pet-list-mock" />} />
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('page-pet-list-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <div data-testid="page-pet-list-mock"></div>
      </div>
    </div>"
  `);
  });
});
