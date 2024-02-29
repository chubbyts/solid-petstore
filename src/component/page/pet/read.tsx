import type { Component } from 'solid-js';
import { For, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { H1 } from '../../heading';
import { useParams } from '@solidjs/router';
import type { PetResponse } from '../../../model/pet';
import { HttpError } from '../../../client/error';
import { ReadPet } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { AnchorButton } from '../../button';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';

const pageTitle = 'Pet Read';

const PetRead: Component = () => {
  const params = useParams();
  const id = params.id;

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

  createEffect(() => {
    document.title = pageTitle;

    fetchPet();
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <Show when={getPetOrUndefined() || getHttpErrorOrUndefined()}>
      <div data-testid="page-pet-read">
        <Show when={getHttpErrorOrUndefined()}>
          {(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}
        </Show>
        <H1>{pageTitle}</H1>
        <Show when={getPetOrUndefined()}>
          {(getPet) => (
            <div>
              <dl>
                <dt class="font-bold">Id</dt>
                <dd class="mb-4">{getPet().id}</dd>
                <dt class="font-bold">CreatedAt</dt>
                <dd class="mb-4">{format(Date.parse(getPet().createdAt), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}</dd>
                <dt class="font-bold">UpdatedAt</dt>
                <dd class="mb-4">
                  <Show when={getPet().updatedAt}>
                    {(getUpdatedAt) => format(Date.parse(getUpdatedAt()), 'dd.MM.yyyy - HH:mm:ss', { locale: de })}
                  </Show>
                </dd>
                <dt class="font-bold">Name</dt>
                <dd class="mb-4">{getPet().name}</dd>
                <dt class="font-bold">Tag</dt>
                <dd class="mb-4">{getPet().tag}</dd>
                <dt class="font-bold">Vaccinations</dt>
                <dd class="mb-4">
                  <Show when={getPet().vaccinations}>
                    {(getVaccinations) => (
                      <ul>
                        <For each={getVaccinations()}>{(vaccination) => <li>{vaccination.name}</li>}</For>
                      </ul>
                    )}
                  </Show>
                </dd>
              </dl>
            </div>
          )}
        </Show>
        <AnchorButton href="/pet" colorTheme="gray">
          List
        </AnchorButton>
      </div>
    </Show>
  );
};

export default PetRead;
