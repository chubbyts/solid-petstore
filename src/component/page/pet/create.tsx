import type { Component } from 'solid-js';
import { Show, createEffect, onCleanup } from 'solid-js';
import { H1 } from '../../heading';
import { useNavigate } from '@solidjs/router';
import { createPetClient as createClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';
import type { PetRequest } from '../../../model/pet';
import { createModelResource } from '../../../hook/create-model-resource';

const pageTitle = 'Pet Create';

const PetCreate: Component = () => {
  const navigate = useNavigate();

  const { getHttpError, actions } = createModelResource({ createClient });

  const submitPet = async (pet: PetRequest) => {
    if (await actions.createModel(pet)) {
      navigate('/pet');
    }
  };

  createEffect(() => {
    document.title = pageTitle;
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <div data-testid="page-pet-create">
      <Show when={getHttpError()}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
      <H1>{pageTitle}</H1>
      <PetForm getHttpError={getHttpError} getInitialPet={() => undefined} submitPet={submitPet} />
      <AnchorButton href="/pet" colorTheme="gray">
        List
      </AnchorButton>
    </div>
  );
};

export default PetCreate;
