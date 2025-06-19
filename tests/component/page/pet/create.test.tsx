/** @jsxImportSource solid-js */

import { userEvent } from '@testing-library/user-event';
import { vi, test, expect, describe } from 'vitest';
import type { RouteSectionProps } from '@solidjs/router';
import { Route, Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { render, screen } from '@solidjs/testing-library';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import nock from 'nock';
import { formatHtml } from '../../../formatter';
import type { PetFormProps } from '../../../../src/component/form/pet-form';
import Create from '../../../../src/component/page/pet/create';

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

describe('page - pet - create', () => {
  test('default', async () => {
    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
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
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    await screen.findByTestId('page-pet-create');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-create">
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Create</h1>
        <button data-testid="pet-form-submit" data-has-http-error="false" data-has-initial-pet="false"></button>
        <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
          link="">List</a>
      </div>
    </div>"
  `);
  });

  test('unprocessable entity', async () => {
    nock('https://petstore.test').post('/api/pets', { name: 'Brownie', vaccinations: [] }).reply(422, {
      type: 'https://datatracker.ietf.org/doc/html/rfc2616#section-10.4.5',
      status: 422,
      title: 'Unprocessable Entity',
      _httpError: 'UnprocessableEntity',
      detail: 'Field validation issues',
    });

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
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
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('http-error');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-create">
        <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
          <p class="font-bold">Unprocessable Entity</p>
          <p>Field validation issues</p>
        </div>
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Pet Create</h1>
        <button data-testid="pet-form-submit" data-has-http-error="true" data-has-initial-pet="false"></button>
        <a colortheme="gray" href="/pet" class="inline-block px-5 py-2 text-white bg-gray-600 hover:bg-gray-700 active"
          link="">List</a>
      </div>
    </div>"
  `);
  });

  test('successful', async () => {
    nock('https://petstore.test').post('/api/pets', { name: 'Brownie', vaccinations: [] }).reply(200, {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2005-08-15T15:52:01+00:00',
      _links: {},
    });

    const App = (props: RouteSectionProps) => {
      const navigate = useNavigate();

      createEffect(() => {
        navigate('/pet/create', { scroll: false });
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
        <Route path="/pet" component={() => <div data-testid="page-pet-list-mock" />} />
        <Route path="/pet/create" component={Create} />
      </Router>
    ));

    const testButton = await screen.findByTestId('pet-form-submit');

    await userEvent.click(testButton);

    await screen.findByTestId('page-pet-list-mock');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="page-pet-list-mock"></div>
    </div>"
  `);
  });
});
