import type { Component } from 'solid-js';
import { Show, createEffect, onCleanup } from 'solid-js';
import { H1 } from '../../heading';
import { useNavigate, useParams } from '@solidjs/router';
import type { PetRequest } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { AnchorButton } from '../../button';
import { PetForm } from '../../form/pet-form';
import { createModelResource } from '../../../hook/create-model-resource';

const pageTitle = 'Pet Update';

const PetUpdate: Component = () => {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const { getModel, getHttpError, actions } = createModelResource({ readClient, updateClient });

  const submitPet = async (petRequest: PetRequest) => {
    await actions.updateModel(id, petRequest);

    if (!getHttpError()) {
      navigate('/pet');
    }
  };

  createEffect(() => {
    document.title = pageTitle;
    actions.readModel(id);
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <Show when={getModel() || getHttpError()}>
      <div data-testid="page-pet-update">
        <Show when={getHttpError()}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
        <H1>{pageTitle}</H1>
        <Show when={getModel()}>
          {(getPet) => <PetForm getHttpError={getHttpError} getInitialPet={getPet} submitPet={submitPet} />}
        </Show>
        <AnchorButton href="/pet" colorTheme="gray">
          List
        </AnchorButton>
      </div>
    </Show>
  );
};

export default PetUpdate;
