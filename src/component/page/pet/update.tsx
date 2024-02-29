import type { Component } from 'solid-js';
import { Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { H1 } from '../../heading';
import { useNavigate, useParams } from '@solidjs/router';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { HttpError } from '../../../client/error';
import { ReadPet, UpdatePet } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { AnchorButton } from '../../button';
import { PetForm } from '../../form/pet-form';

const pageTitle = 'Pet Update';

const PetUpdate: Component = () => {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const [getPetOrUndefined, setPetOrUndefined] = createSignal<PetResponse>();
  const [getHttpErrorOrUndefined, setHttpErrorOrUndefined] = createSignal<HttpError>();

  const fetchPet = async () => {
    const response = await ReadPet(id);

    if (response instanceof HttpError) {
      setHttpErrorOrUndefined(response);
    } else {
      setHttpErrorOrUndefined(undefined);
      setPetOrUndefined(response);
    }
  };

  const submitPet = async (petRequest: PetRequest) => {
    const response = await UpdatePet(id, petRequest);

    if (response instanceof HttpError) {
      setHttpErrorOrUndefined(response);
    } else {
      setHttpErrorOrUndefined(undefined);
      setPetOrUndefined(response);

      navigate('/pet');
    }
  };

  createEffect(() => {
    document.title = pageTitle;

    fetchPet();
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <Show when={getPetOrUndefined() || getHttpErrorOrUndefined()}>
      <div data-testid="page-pet-update">
        <Show when={getHttpErrorOrUndefined()}>
          {(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}
        </Show>
        <H1>{pageTitle}</H1>
        <Show when={getPetOrUndefined()}>
          {(getPet) => (
            <PetForm getHttpErrorOrUndefined={getHttpErrorOrUndefined} getInitialPet={getPet} submitPet={submitPet} />
          )}
        </Show>
        <AnchorButton href="/pet" colorTheme="gray">
          List
        </AnchorButton>
      </div>
    </Show>
  );
};

export default PetUpdate;
