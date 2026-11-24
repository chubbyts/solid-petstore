import type { Component } from 'solid-js';
import { createEffect, createMemo, createSignal, on, onCleanup } from 'solid-js';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { cx } from '../class-names';
import { SearchIcon } from '../icon';
import type { PetFilters } from '../../model/pet';
import { FieldErrors, inputClasses } from './form';

// filters while typing, once there was no keystroke for this long (ms): not a request per character
export const filterDelay = 300;

export type PetFiltersFormProps = {
  getHttpError: () => HttpError | undefined;
  getInitialPetFilters: () => PetFilters;
  submitPetFilters: (petFilters: PetFilters) => void;
};

export const PetFiltersForm: Component<PetFiltersFormProps> = (props: PetFiltersFormProps) => {
  const getGroupInvalidParametersByName = createMemo(() => createInvalidParametersByName(props.getHttpError()));
  const getInvalidParameters = () => getGroupInvalidParametersByName().get('filters[name]') ?? [];
  const hasError = () => getInvalidParameters().length > 0;

  const getInitialName = () => props.getInitialPetFilters().name ?? '';
  const [getName, setName] = createSignal<string>(getInitialName());

  // the last name submitted from here (or received from outside)
  // oxlint-disable-next-line functional/no-let
  let submittedName = getInitialName();

  // follow outer changes (e.g. "Clear filter"), but not the ones submitted from here: would undo the typing since
  createEffect(
    on(getInitialName, (initialName) => {
      if (initialName === submittedName) {
        return;
      }

      submittedName = initialName;
      setName(initialName);
    }),
  );

  const submit = (value: string) => {
    if (value === submittedName) {
      return;
    }

    submittedName = value;
    props.submitPetFilters({ ...props.getInitialPetFilters(), name: value === '' ? undefined : value });
  };

  // restarts the delay on typing only: other updates (e.g. a refetch) don't postpone the filtering
  createEffect(
    on(
      getName,
      (name) => {
        const timeout = setTimeout(() => submit(name), filterDelay);

        onCleanup(() => clearTimeout(timeout));
      },
      { defer: true },
    ),
  );

  return (
    <form
      role="search"
      class="flex flex-[1_1_260px] flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        submit(getName());
      }}
    >
      <label class="relative flex items-center">
        <span class="sr-only">Filter by name</span>
        <span class="text-fg-muted pointer-events-none absolute left-3 flex">
          <SearchIcon />
        </span>
        <input
          data-testid="pet-filters-form-name"
          type="search"
          placeholder="Filter by name"
          class={cx('h-10 w-full pr-3 pl-9', inputClasses(hasError()))}
          aria-invalid={hasError() || undefined}
          aria-describedby={cx('pet-filters-name-hint', hasError() && 'pet-filters-name-errors')}
          value={getName()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
      </label>
      <span id="pet-filters-name-hint" class="sr-only">
        Results update as you type
      </span>
      <FieldErrors id="pet-filters-name-errors" getInvalidParameters={getInvalidParameters} />
    </form>
  );
};
