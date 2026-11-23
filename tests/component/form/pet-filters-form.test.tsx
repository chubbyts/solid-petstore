/** @jsxImportSource solid-js */

import { test, expect, vi, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, screen } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { formatHtml } from '../../formatter';
import { filterDelay, PetFiltersForm } from '../../../src/component/form/pet-filters-form';
import { BadRequest } from '../../../src/client/error';
import type { PetFilters } from '../../../src/model/pet';

const submitPetFilters = (): void => {};

describe('pet-filters-form', () => {
  test('default', () => {
    const { container } = render(() => (
      <PetFiltersForm
        getHttpError={() => undefined}
        getInitialPetFilters={() => ({})}
        submitPetFilters={submitPetFilters}
      />
    ));

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <form role="search" class="flex flex-[1_1_260px] flex-col gap-1">
          <label class="relative flex items-center">
            <span class="sr-only">Filter by name</span>
            <span class="text-fg-muted pointer-events-none absolute left-3 flex">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" width="16" height="16" stroke-width="2">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-3.5-3.5"></path>
              </svg>
            </span>
            <input data-testid="pet-filters-form-name" type="search" placeholder="Filter by name"
              class="h-10 w-full pr-3 pl-9 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-line-control bg-canvas"
              aria-describedby="pet-filters-name-hint">
          </label>
          <span id="pet-filters-name-hint" class="sr-only">Results update as you type</span>
        </form>
      </div>"
    `);
  });

  test('bad request with invalid name', () => {
    const httpError = new BadRequest({
      title: 'Bad Request',
      invalidParameters: [{ name: 'filters[name]', reason: 'Too small' }],
    });

    const { container } = render(() => (
      <PetFiltersForm
        getHttpError={() => httpError}
        getInitialPetFilters={() => ({ name: '' })}
        submitPetFilters={submitPetFilters}
      />
    ));

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <form role="search" class="flex flex-[1_1_260px] flex-col gap-1">
          <label class="relative flex items-center">
            <span class="sr-only">Filter by name</span>
            <span class="text-fg-muted pointer-events-none absolute left-3 flex">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" width="16" height="16" stroke-width="2">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="m20 20-3.5-3.5"></path>
              </svg>
            </span>
            <input data-testid="pet-filters-form-name" type="search" placeholder="Filter by name"
              class="h-10 w-full pr-3 pl-9 min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus border-danger-field-line bg-danger-field"
              aria-invalid="true" aria-describedby="pet-filters-name-hint pet-filters-name-errors">
          </label>
          <span id="pet-filters-name-hint" class="sr-only">Results update as you type</span>
          <ul class="text-danger m-0 list-none p-0 text-[13px]" id="pet-filters-name-errors">
            <li>Too small</li>
          </ul>
        </form>
      </div>"
    `);
  });

  test('submit on enter', async () => {
    const submitPetFiltersMock = vi.fn((_: PetFilters) => {});

    render(() => (
      <PetFiltersForm
        getHttpError={() => undefined}
        getInitialPetFilters={() => ({})}
        submitPetFilters={submitPetFiltersMock}
      />
    ));

    const input = screen.getByRole('searchbox', { name: 'Filter by name' });

    // unchanged: no submit
    await userEvent.type(input, '{Enter}');

    await userEvent.type(input, 'Brownie{Enter}');

    expect(submitPetFiltersMock).toHaveBeenCalledTimes(1);
    expect(submitPetFiltersMock).toHaveBeenNthCalledWith(1, { name: 'Brownie' });
  });

  test('submit while typing, once per pause', async () => {
    const submitPetFiltersMock = vi.fn((_: PetFilters) => {});
    const [getInitialPetFilters, setInitialPetFilters] = createSignal<PetFilters>({});

    render(() => (
      <PetFiltersForm
        getHttpError={() => undefined}
        getInitialPetFilters={getInitialPetFilters}
        submitPetFilters={submitPetFiltersMock}
      />
    ));

    const input = screen.getByRole('searchbox', { name: 'Filter by name' }) as HTMLInputElement;

    await userEvent.type(input, 'Bro');

    // not per character
    expect(submitPetFiltersMock).toHaveBeenCalledTimes(0);

    await vi.waitFor(() => expect(submitPetFiltersMock).toHaveBeenCalledTimes(1));
    expect(submitPetFiltersMock).toHaveBeenNthCalledWith(1, { name: 'Bro' });

    await userEvent.type(input, 'wn');

    // the submitted filter arrives (url) while typing: the typing is kept
    setInitialPetFilters({ name: 'Bro' });

    expect(input.value).toBe('Brown');

    await vi.waitFor(() => expect(submitPetFiltersMock).toHaveBeenCalledTimes(2));
    expect(submitPetFiltersMock).toHaveBeenNthCalledWith(2, { name: 'Brown' });

    // no further submits once the filter is applied
    setInitialPetFilters({ name: 'Brown' });
    await new Promise((resolve) => setTimeout(resolve, filterDelay * 2));
    expect(submitPetFiltersMock).toHaveBeenCalledTimes(2);
  });

  test('other updates neither postpone the submit nor use outdated props', async () => {
    const outdatedSubmitPetFiltersMock = vi.fn((_: PetFilters) => {});
    const submitPetFiltersMock = vi.fn((_: PetFilters) => {});
    const [getSubmitPetFilters, setSubmitPetFilters] = createSignal(outdatedSubmitPetFiltersMock);
    const [getInitialPetFilters, setInitialPetFilters] = createSignal<PetFilters>({});

    render(() => (
      <PetFiltersForm
        getHttpError={() => undefined}
        getInitialPetFilters={getInitialPetFilters}
        submitPetFilters={getSubmitPetFilters()}
      />
    ));

    const input = screen.getByRole('searchbox', { name: 'Filter by name' });

    await userEvent.type(input, 'Bro');

    const typedAt = Date.now();

    // e.g. a refetch: new props while waiting
    for (const _ of [1, 2, 3, 4]) {
      setSubmitPetFilters(() => submitPetFiltersMock);
      setInitialPetFilters({});
      await new Promise((resolve) => setTimeout(resolve, filterDelay / 4));
    }

    await vi.waitFor(() => expect(submitPetFiltersMock).toHaveBeenCalledTimes(1));
    expect(Date.now() - typedAt).toBeLessThan(filterDelay * 1.5);
    expect(submitPetFiltersMock).toHaveBeenNthCalledWith(1, { name: 'Bro' });
    expect(outdatedSubmitPetFiltersMock).not.toHaveBeenCalled();
  });

  test('submit when cleared and follow outer changes', async () => {
    const submitPetFiltersMock = vi.fn((_: PetFilters) => {});
    const [getInitialPetFilters, setInitialPetFilters] = createSignal<PetFilters>({ name: 'Brownie' });

    render(() => (
      <PetFiltersForm
        getHttpError={() => undefined}
        getInitialPetFilters={getInitialPetFilters}
        submitPetFilters={submitPetFiltersMock}
      />
    ));

    const input = screen.getByRole('searchbox', { name: 'Filter by name' }) as HTMLInputElement;

    expect(input.value).toBe('Brownie');

    await userEvent.clear(input);

    await vi.waitFor(() => expect(submitPetFiltersMock).toHaveBeenCalledTimes(1));
    expect(submitPetFiltersMock).toHaveBeenNthCalledWith(1, { name: undefined });

    // outer change (e.g. "Clear filter" or browser navigation)
    setInitialPetFilters({ name: 'Snowball' });

    expect(input.value).toBe('Snowball');

    // taken as submitted: no submit of it
    await new Promise((resolve) => setTimeout(resolve, filterDelay * 2));
    expect(submitPetFiltersMock).toHaveBeenCalledTimes(1);
  });
});
