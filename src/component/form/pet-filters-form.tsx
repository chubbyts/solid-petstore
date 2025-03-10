import type { Component } from 'solid-js';
import { createEffect, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createInvalidParametersByName, type HttpError } from '../../client/error';
import type { PetFilters } from '../../model/pet';
import { Button } from '../button';
import { FieldSet, TextField } from './form';

export type PetFiltersFormProps = {
  getHttpError: () => HttpError | undefined;
  getInitialPetFilters: () => PetFilters;
  submitPetFilters: (petFilters: PetFilters) => void;
};

export const PetFiltersForm: Component<PetFiltersFormProps> = (props: PetFiltersFormProps) => {
  const getGroupInvalidParametersByName = createMemo(() => createInvalidParametersByName(props.getHttpError()));

  const [petFilters, setPetFilters] = createStore<PetFilters>({});

  const onSubmit = () => {
    props.submitPetFilters({ ...petFilters });
  };

  createEffect(() => {
    setPetFilters(props.getInitialPetFilters());
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
      }}
    >
      <FieldSet>
        <TextField
          data-testid="pet-filters-form-name"
          label="Name"
          getValue={() => petFilters.name ?? ''}
          setValue={(value) => setPetFilters('name', value === '' ? undefined : value)}
          getInvalidParameters={() => getGroupInvalidParametersByName().get('filters[name]') ?? []}
        />
        <Button data-testid="pet-filters-form-submit" colorTheme="blue">
          Filter
        </Button>
      </FieldSet>
    </form>
  );
};
