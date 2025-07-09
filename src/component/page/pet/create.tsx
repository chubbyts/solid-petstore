import type { Component } from 'solid-js';
import { Show, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useMutation } from '@tanstack/solid-query';
import { H1 } from '../../heading';
import { createPetClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';
import type { PetRequest, PetResponse } from '../../../model/pet';
import type { HttpError } from '../../../client/error';
import { provideCreateMutationFn } from '../../../hook/use-query';

const pageTitle = 'Pet Create';

const PetCreate: Component = () => {
  const navigate = useNavigate();

  const petMutation = useMutation<PetResponse, HttpError, PetRequest>(() => ({
    mutationFn: provideCreateMutationFn(createPetClient),
    onSuccess: () => {
      navigate('/pet');
    },
    retry: false,
  }));

  const submitPet = async (petRequest: PetRequest) => {
    petMutation.mutate(petRequest);
  };

  createEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  });

  return (
    <div data-testid="page-pet-create">
      <Show when={petMutation.error}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
      <H1>{pageTitle}</H1>
      <PetForm
        getHttpError={() => petMutation.error ?? undefined}
        getInitialPet={() => undefined}
        submitPet={submitPet}
      />
      <AnchorButton href="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default PetCreate;
