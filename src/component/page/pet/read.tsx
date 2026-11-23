import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { useQuery } from '@tanstack/solid-query';
import { Loading } from '../../partial/loading';
import { Breadcrumb, PageHeader } from '../../heading';
import { AnchorButton } from '../../button';
import { Card, CardBody, CardFooter, Meta } from '../../card';
import { BackToList } from '../../partial/back-to-list';
import { labelClasses } from '../../form/form';
import { readPetClient } from '../../../client/pet';
import type { PetResponse } from '../../../model/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn } from '../../../hook/use-query';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Pet';

// styled like the (read only) form inputs: 44px for name and tag, 40px for vaccinations
const valueClasses = 'm-0 flex items-center rounded-lg border border-line bg-surface-muted px-3 break-all';

const PetRead: Component = () => {
  const params = useParams<{ id: string }>();

  const petQuery = useQuery<PetResponse, HttpError>(() => ({
    queryKey: ['pets', params.id],
    queryFn: provideReadQueryFn(readPetClient, params.id),
    retry: false,
  }));

  const getTitle = () => petQuery.data?.name ?? pageTitle;

  useDocumentTitle(getTitle);
  usePageError(() => petQuery.error);

  return (
    <Show when={!petQuery.isLoading} fallback={<Loading />}>
      <div data-testid="page-pet-read" class="flex flex-col gap-[22px]">
        <Breadcrumb items={[{ label: 'Pets', href: '/pet' }, { label: getTitle() }]} />
        <PageHeader title={getTitle()} action={petQuery.data ? undefined : <BackToList href="/pet" />} />
        <Show when={petQuery.data}>
          {(getPet) => (
            <Card aria-label="Pet details">
              <CardBody>
                <dl class="m-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div class="flex flex-col gap-1.5">
                    <dt class={labelClasses}>Name</dt>
                    <dd class={`${valueClasses} min-h-11`}>{getPet().name}</dd>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <dt class={labelClasses}>Tag</dt>
                    <dd class={`${valueClasses} min-h-11`}>{getPet().tag}</dd>
                  </div>
                </dl>
                <div class="flex flex-col gap-2">
                  <div class="flex min-h-[34px] items-center">
                    <h2 id="pet-vaccinations" class={`m-0 ${labelClasses}`}>
                      Vaccinations <span class="text-fg-muted font-normal">({getPet().vaccinations.length})</span>
                    </h2>
                  </div>
                  <Show
                    when={getPet().vaccinations.length > 0}
                    fallback={
                      <p class="border-line-strong text-fg-muted m-0 rounded-lg border border-dashed p-4 text-center text-sm">
                        No vaccinations recorded.
                      </p>
                    }
                  >
                    <ol aria-labelledby="pet-vaccinations" class="m-0 flex list-none flex-col gap-2 p-0">
                      <For each={getPet().vaccinations}>
                        {(vaccination) => <li class={`${valueClasses} min-h-10`}>{vaccination.name}</li>}
                      </For>
                    </ol>
                  </Show>
                </div>
              </CardBody>
              <CardFooter>
                <Meta id={getPet().id} createdAt={getPet().createdAt} updatedAt={getPet().updatedAt} />
                <span class="flex-1" />
                <BackToList href="/pet" />
                <Show when={getPet()._links?.update}>
                  <AnchorButton data-testid="pet-update" href={`/pet/${getPet().id}/update`} variant="primary">
                    Edit
                  </AnchorButton>
                </Show>
              </CardFooter>
            </Card>
          )}
        </Show>
      </div>
    </Show>
  );
};

export default PetRead;
