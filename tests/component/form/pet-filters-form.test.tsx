/** @jsxImportSource solid-js */

import { test, expect, vi } from 'vitest';
import { formatHtml } from '../../formatter';
import { PetFiltersForm } from '../../../src/component/form/pet-filters-form';
import { render, screen } from '@solidjs/testing-library';
import { BadRequest, NetworkError } from '../../../src/client/error';
import { userEvent } from '@testing-library/user-event';
import type { PetFilters } from '../../../src/model/pet';

test('default', () => {
  const getHttpErrorOrUndefined = () => undefined;
  const getInitialPetFilters = () => ({});
  const submitPetFilters = () => {};

  const { container } = render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block"
            >Name<input
              type="text"
              data-testid="pet-filters-form-name"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-gray-300" /></label
          ><button
            data-testid="pet-filters-form-submit"
            colortheme="blue"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Filter
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('network error', () => {
  const getHttpErrorOrUndefined = () => new NetworkError({ title: 'network error' });
  const getInitialPetFilters = () => ({});
  const submitPetFilters = () => {};

  render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));
});

test('bad request', () => {
  const getHttpErrorOrUndefined = () =>
    new BadRequest({
      title: 'bad request',
    });
  const getInitialPetFilters = () => ({});
  const submitPetFilters = () => {};

  render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));
});

test('bad request - with query string name', () => {
  const getHttpErrorOrUndefined = () =>
    new BadRequest({ title: 'bad request', invalidParameters: [{ name: 'filters[name]', reason: 'reason' }] });
  const getInitialPetFilters = () => ({});
  const submitPetFilters = () => {};

  const { container } = render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <form>
        <fieldset class="mb-3 border border-gray-300 px-4 py-3">
          <label class="block"
            >Name<input
              type="text"
              data-testid="pet-filters-form-name"
              class="mb-3 mt-2 block w-full border px-3 py-2 border-red-600 bg-red-100"
            />
            <ul class="mb-3 text-red-600">
              <li>reason</li>
            </ul></label
          ><button
            data-testid="pet-filters-form-submit"
            colortheme="blue"
            class="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700"
          >
            Filter
          </button>
        </fieldset>
      </form>
    </div>
    "
  `);
});

test('submit with name', async () => {
  const getHttpErrorOrUndefined = () => undefined;
  const getInitialPetFilters = () => ({ name: 'Brown' });
  const submitPetFilters = vi.fn((petFilters: PetFilters) => {
    expect(petFilters).toEqual({ name: 'Brownie' });
  });

  render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));

  const nameField = await screen.findByTestId('pet-filters-form-name');

  await userEvent.type(nameField, 'ie');

  const submitButton = await screen.findByTestId('pet-filters-form-submit');

  await userEvent.click(submitButton);

  expect(submitPetFilters).toHaveBeenCalledTimes(1);
});

test('submit without name', async () => {
  const getHttpErrorOrUndefined = () => undefined;
  const getInitialPetFilters = () => ({ name: '' });
  const submitPetFilters = vi.fn((petFilters: PetFilters) => {
    expect(petFilters).toEqual({ name: undefined });
  });

  render(() => (
    <PetFiltersForm
      getHttpErrorOrUndefined={getHttpErrorOrUndefined}
      getInitialPetFilters={getInitialPetFilters}
      submitPetFilters={submitPetFilters}
    />
  ));

  const nameField = await screen.findByTestId('pet-filters-form-name');

  await userEvent.type(nameField, '{enter}');

  expect(submitPetFilters).toHaveBeenCalledTimes(1);
});
