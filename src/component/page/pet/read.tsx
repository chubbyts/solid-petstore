import type { Component } from 'solid-js';
import { For, Show, createEffect } from 'solid-js';
import { useParams } from '@solidjs/router';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/solid-query';
import { H1 } from '../../heading';
import { readPetClient as readClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { AnchorButton } from '../../button';
import { provideReadQueryFn } from '../../../hook/use-query';
import type { HttpError } from '../../../client/error';
import type { PetResponse } from '../../../model/pet';

const pageTitle = 'Pet Read';

const PetRead: Component = () => {
  const params = useParams();

  const petQuery = useQuery<PetResponse, HttpError>(() => ({
    queryKey: ['pets', params.id],
    queryFn: provideReadQueryFn(readClient, params.id),
    retry: false,
  }));

  createEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  });

  return (
    <Show when={!petQuery.isLoading}>
      <div data-testid="page-pet-read">
        <Show when={petQuery.error}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
        <H1>{pageTitle}</H1>
        <Show when={petQuery.data}>
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
                  <Show when={getPet().vaccinations.length > 0}>
                    <ul>
                      <For each={getPet().vaccinations}>{(vaccination) => <li>{vaccination.name}</li>}</For>
                    </ul>
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
