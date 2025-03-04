import type { Component } from 'solid-js';
import { For, createEffect, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createInvalidParametersByName, type HttpError } from '../../client/error';
import type { PetRequest } from '../../model/pet';
import { Button } from '../button';
import { FieldSet, TextField } from './form';

export type PetFormProps = {
  getHttpError: () => HttpError | undefined;
  getInitialPet: () => PetRequest | undefined;
  submitPet: (pet: PetRequest) => void;
};

export const PetForm: Component<PetFormProps> = (props: PetFormProps) => {
  const getGroupInvalidParametersByName = createMemo(() => createInvalidParametersByName(props.getHttpError()));

  const [pet, setPet] = createStore<PetRequest>({ name: '', vaccinations: [] });

  const onSubmit = () => {
    props.submitPet({ ...pet });
  };

  createEffect(() => {
    const initialPet = props.getInitialPet();
    if (initialPet) {
      setPet(initialPet);
    }
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
          data-testid="pet-form-name"
          label="Name"
          getValue={() => pet.name}
          setValue={(value) => setPet('name', value)}
          getInvalidParameters={() => getGroupInvalidParametersByName().get('name') ?? []}
        />
        <TextField
          data-testid="pet-form-tag"
          label="Tag"
          getValue={() => pet.tag ?? ''}
          setValue={(value) => setPet('tag', value === '' ? undefined : value)}
          getInvalidParameters={() => getGroupInvalidParametersByName().get('tag') ?? []}
        />
        <div class="mb-3">
          <div class="mb-2 block">Vaccinations</div>
          <div>
            <For each={pet.vaccinations}>
              {(vaccination, getIndex) => (
                <FieldSet>
                  <TextField
                    data-testid={`pet-form-vaccinations-${getIndex()}-name`}
                    label="Name"
                    getValue={() => vaccination.name}
                    setValue={(value) =>
                      setPet('vaccinations', [
                        ...pet.vaccinations.map((currentVaccination, i) => {
                          if (i === getIndex()) {
                            return { ...currentVaccination, name: value };
                          }

                          return currentVaccination;
                        }),
                      ])
                    }
                    getInvalidParameters={() =>
                      getGroupInvalidParametersByName().get(`vaccinations[${getIndex()}][name]`) ?? []
                    }
                  />
                  <Button
                    data-testid={`pet-form-remove-vaccination-${getIndex()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setPet('vaccinations', [...pet.vaccinations.filter((_, i) => i !== getIndex())]);
                    }}
                    colorTheme="red"
                    class="mb-3"
                  >
                    Remove
                  </Button>
                </FieldSet>
              )}
            </For>
            <Button
              data-testid={'pet-form-add-vaccination'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setPet('vaccinations', [...pet.vaccinations, { name: '' }]);
              }}
              colorTheme="green"
            >
              Add
            </Button>
          </div>
        </div>
        <Button data-testid="pet-form-submit" colorTheme="blue">
          Save
        </Button>
      </FieldSet>
    </form>
  );
};
