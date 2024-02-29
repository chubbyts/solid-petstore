import type { Component } from 'solid-js';
import { Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { H1 } from '../../heading';
import { HttpError } from '../../../client/error';
import { useNavigate } from '@solidjs/router';
import { CreatePet } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { PetForm } from '../../form/pet-form';
import { AnchorButton } from '../../button';
import type { PetRequest } from '../../../model/pet';

const pageTitle = 'Pet Create';

const PetCreate: Component = () => {
  const navigate = useNavigate();

  const [getHttpErrorOrUndefined, setHttpErrorOrUndefined] = createSignal<HttpError>();

  const submitPet = async (pet: PetRequest) => {
    const response = await CreatePet(pet);

    if (response instanceof HttpError) {
      setHttpErrorOrUndefined(response);
    } else {
      setHttpErrorOrUndefined(undefined);

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
      <Show when={getHttpErrorOrUndefined()}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
      <H1>{pageTitle}</H1>
      <PetForm
        getHttpErrorOrUndefined={getHttpErrorOrUndefined}
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
