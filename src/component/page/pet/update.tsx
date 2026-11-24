import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query';
import { Loading } from '../../partial/loading';
import { BackToList } from '../../partial/back-to-list';
import { PetForm } from '../../form/pet-form';
import { Breadcrumb, PageHeader } from '../../heading';
import { Meta } from '../../card';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'Edit pet';

const PetUpdate: Component = () => {
  const params = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToast();

  const petQuery = useQuery<PetResponse, HttpError>(() => ({
    queryKey: ['pets', params.id],
    queryFn: provideReadQueryFn(readClient, params.id),
    retry: false,
  }));

  const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>(() => ({
    mutationFn: provideUpdateMutationFn(updateClient),
    onSuccess: (pet, [id]) => {
      showToast(`Saved “${pet.name}” — 200 OK`);
      queryClient.setQueryData(['pets', id], pet);
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate(`/pet/${id}`);
    },
    retry: false,
  }));

  const submitPet = (petRequest: PetRequest): void => {
    petMutation.mutate([params.id, petRequest]);
  };

  const getTitle = () => (petQuery.data ? `Edit ${petQuery.data.name}` : pageTitle);

  useDocumentTitle(getTitle);
  usePageError(
    () => petMutation.error ?? petQuery.error,
    () => Boolean(petMutation.error),
  );

  return (
    <Show when={!petQuery.isLoading} fallback={<Loading />}>
      <div data-testid="page-pet-update" class="flex flex-col gap-[22px]">
        <Breadcrumb
          items={[
            { label: 'Pets', href: '/pet' },
            ...(petQuery.data ? [{ label: petQuery.data.name, href: `/pet/${params.id}` }] : []),
            { label: 'Edit' },
          ]}
        />
        <PageHeader title={getTitle()} action={petQuery.data ? undefined : <BackToList href="/pet" />} />
        <Show when={petQuery.data}>
          {(getPet) => (
            <PetForm
              getHttpError={() => petMutation.error ?? undefined}
              getInitialPet={getPet}
              submitPet={submitPet}
              submitLabel="Save changes"
              cancelHref={`/pet/${params.id}`}
              listHref="/pet"
              meta={<Meta id={getPet().id} createdAt={getPet().createdAt} updatedAt={getPet().updatedAt} />}
              getIsPending={() => petMutation.isPending}
            />
          )}
        </Show>
      </div>
    </Show>
  );
};

export default PetUpdate;
