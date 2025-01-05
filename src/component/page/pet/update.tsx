import type { Component } from 'solid-js';
import { Show, createEffect } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { H1 } from '../../heading';
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

  const { getModel: getPet, getHttpError, actions } = createModelResource({ readClient, updateClient });

  const submitPet = async (petRequest: PetRequest) => {
    if (await actions.updateModel(id, petRequest)) {
      navigate('/pet');
    }
  };

  createEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
    actions.readModel(id);
  });

  return (
    <Show when={getPet() || getHttpError()}>
      <div data-testid="page-pet-update">
        <Show when={getHttpError()}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
        <H1>{pageTitle}</H1>
        <Show when={getPet()}>
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
