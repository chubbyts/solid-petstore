import type { Component, JSX } from 'solid-js';
import { createEffect, createMemo, For, on, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { HttpError } from '../../client/error';
import { createInvalidParametersByName } from '../../client/error';
import { AnchorButton, Button } from '../button';
import { cardClasses, CardBody, CardFooter } from '../card';
import { cx } from '../class-names';
import { TrashIcon } from '../icon';
import { BackToList } from '../partial/back-to-list';
import { useListKeys } from '../../hook/use-list-keys';
import type { PetRequest } from '../../model/pet';
import { FieldErrors, inputClasses, labelClasses, TextField } from './form';

export type PetFormProps = {
  getHttpError: () => HttpError | undefined;
  getInitialPet: () => PetRequest | undefined;
  submitPet: (pet: PetRequest) => void;
  submitLabel: string;
  cancelHref: string;
  listHref: string;
  meta?: JSX.Element;
  getIsPending?: () => boolean;
};

// a copy: the store changes it, the initial pet (e.g. cached by the query) has to stay as is
const copyPet = (pet: PetRequest | undefined): PetRequest =>
  pet
    ? { ...pet, vaccinations: pet.vaccinations.map((vaccination) => ({ ...vaccination })) }
    : { name: '', vaccinations: [] };

// the dom is updated synchronously: the element to focus exists right after setting the pet
const focusById = (id: string): void => {
  document.getElementById(id)?.focus();
};

export const PetForm: Component<PetFormProps> = (props: PetFormProps) => {
  const getGroupInvalidParametersByName = createMemo(() => createInvalidParametersByName(props.getHttpError()));

  // the form is created with the pet to edit, it does not follow later changes of it
  const [pet, setPet] = createStore<PetRequest>(copyPet(props.getInitialPet()));

  // errors of a vaccination stay with it when other vaccinations get removed
  const vaccinationKeys = useListKeys(pet.vaccinations.length);

  // oxlint-disable-next-line functional/no-let
  let formRef: HTMLFormElement | undefined;

  // after a failed save, continue at the first invalid field (the summary is announced by its role alert)
  createEffect(
    on(props.getHttpError, (httpError) => {
      if (!httpError) {
        return;
      }

      formRef?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }),
  );

  const addVaccination = (): void => {
    const id = `pet-vaccination-${pet.vaccinations.length}`;

    vaccinationKeys.add();
    setPet('vaccinations', [...pet.vaccinations, { name: '' }]);
    focusById(id);
  };

  // the removed row (and its button) is gone: continue at the row now at that place, the previous one or add
  const removeVaccination = (i: number): void => {
    const remaining = pet.vaccinations.length - 1;
    const id = remaining > 0 ? `pet-vaccination-${Math.min(i, remaining - 1)}` : 'pet-add-vaccination';

    vaccinationKeys.remove(i);
    setPet(
      'vaccinations',
      pet.vaccinations.filter((_, y) => y !== i),
    );
    focusById(id);
  };

  // only the name of the vaccination: the row (and the input with the focus) stays
  const setVaccinationName = (i: number, name: string): void => {
    setPet('vaccinations', i, 'name', name);
  };

  return (
    <form
      ref={(el) => (formRef = el)}
      class={cardClasses}
      novalidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        vaccinationKeys.submit();
        props.submitPet({ ...pet, vaccinations: pet.vaccinations.map((vaccination) => ({ ...vaccination })) });
      }}
    >
      <CardBody>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            data-testid="pet-form-name"
            id="pet-name"
            label={
              <>
                Name{' '}
                <span aria-hidden="true" class="text-danger">
                  *
                </span>
              </>
            }
            required
            getValue={() => pet.name}
            setValue={(value) => setPet('name', value)}
            getInvalidParameters={() => getGroupInvalidParametersByName().get('name') ?? []}
          />
          <TextField
            data-testid="pet-form-tag"
            id="pet-tag"
            label={
              <>
                Tag <span class="text-fg-muted font-normal">· optional</span>
              </>
            }
            placeholder="e.g. dog, cat"
            getValue={() => pet.tag ?? ''}
            setValue={(value) => setPet('tag', value === '' ? undefined : value)}
            getInvalidParameters={() => getGroupInvalidParametersByName().get('tag') ?? []}
          />
        </div>
        <div role="group" aria-labelledby="pet-vaccinations" class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <span id="pet-vaccinations" class={labelClasses}>
              Vaccinations <span class="text-fg-muted font-normal">({pet.vaccinations.length})</span>
            </span>
            <Button
              data-testid="pet-form-add-vaccination"
              id="pet-add-vaccination"
              variant="secondary"
              size="sm"
              class="text-sm"
              onClick={addVaccination}
            >
              + Add vaccination
            </Button>
          </div>
          <FieldErrors
            id="pet-vaccinations-errors"
            getInvalidParameters={() => getGroupInvalidParametersByName().get('vaccinations') ?? []}
          />
          <Show
            when={pet.vaccinations.length > 0}
            fallback={
              <p class="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm">
                No vaccinations yet.
              </p>
            }
          >
            <ol class="m-0 flex list-none flex-col gap-2 p-0">
              <For each={pet.vaccinations}>
                {(vaccination, getIndex) => {
                  const getInvalidParameters = () =>
                    getGroupInvalidParametersByName().get(
                      `vaccinations[${vaccinationKeys.submittedIndex(getIndex())}][name]`,
                    ) ?? [];
                  const hasError = () => getInvalidParameters().length > 0;
                  const getErrorId = () => `pet-vaccination-${getIndex()}-errors`;

                  return (
                    <li class="flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <input
                          data-testid={`pet-form-vaccinations-${getIndex()}-name`}
                          id={`pet-vaccination-${getIndex()}`}
                          type="text"
                          aria-label={`Vaccination ${getIndex() + 1} name`}
                          aria-invalid={hasError() || undefined}
                          aria-describedby={hasError() ? getErrorId() : undefined}
                          class={cx('h-10 flex-1', inputClasses(hasError()))}
                          value={vaccination.name}
                          onInput={(e) => setVaccinationName(getIndex(), e.currentTarget.value)}
                        />
                        <Button
                          data-testid={`pet-form-remove-vaccination-${getIndex()}`}
                          variant="ghost-danger"
                          size="md"
                          class="border-line-control border"
                          aria-label={`Remove vaccination ${getIndex() + 1}`}
                          onClick={() => removeVaccination(getIndex())}
                        >
                          <TrashIcon />
                          Remove
                        </Button>
                      </div>
                      <FieldErrors id={getErrorId()} getInvalidParameters={getInvalidParameters} />
                    </li>
                  );
                }}
              </For>
            </ol>
          </Show>
        </div>
      </CardBody>
      <CardFooter>
        {props.meta}
        <span class="flex-1" />
        <BackToList href={props.listHref} />
        <AnchorButton data-testid="pet-form-cancel" href={props.cancelHref} variant="secondary">
          Cancel
        </AnchorButton>
        <Button data-testid="pet-form-submit" type="submit" variant="primary" disabled={props.getIsPending?.()}>
          {props.submitLabel}
        </Button>
      </CardFooter>
    </form>
  );
};
