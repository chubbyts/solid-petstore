import type { Component } from 'solid-js';
import { BadRequest } from '../../../src/client/error';
import { PetFiltersForm } from '../../../src/component/form/pet-filters-form';

const noop = () => {};

const httpError = new BadRequest({
  title: 'Bad Request',
  invalidParameters: [{ name: 'filters[name]', reason: 'Should be at most 100 characters' }],
});

export const PetFiltersFormStory: Component = () => (
  <div class="flex w-[400px] flex-col gap-4">
    <PetFiltersForm getInitialPetFilters={() => ({})} submitPetFilters={noop} getHttpError={() => undefined} />
    <PetFiltersForm
      getInitialPetFilters={() => ({ name: 'Brownie' })}
      submitPetFilters={noop}
      getHttpError={() => undefined}
    />
    <PetFiltersForm
      getInitialPetFilters={() => ({ name: 'B'.repeat(30) })}
      submitPetFilters={noop}
      getHttpError={() => httpError}
    />
  </div>
);
