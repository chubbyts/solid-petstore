import type { Component } from 'solid-js';
import { Show, createEffect } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/solid-query';
import { H1 } from '../../heading';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { readPetClient as readClient, updatePetClient as updateClient } from '../../../client/pet';
import { HttpError as HttpErrorPartial } from '../../partial/http-error';
import { AnchorButton } from '../../button';
import { PetForm } from '../../form/pet-form';
import { provideReadQueryFn, provideUpdateMutationFn } from '../../../hook/use-query';
import type { HttpError } from '../../../client/error';

const pageTitle = 'Pet Update';

const PetUpdate: Component = () => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const petQuery = useQuery<PetResponse, HttpError>(() => ({
    queryKey: ['pets', params.id],
    queryFn: provideReadQueryFn(readClient, params.id),
    retry: false,
  }));

  const petMutation = useMutation<PetResponse, HttpError, [string, PetRequest]>(() => ({
    mutationFn: provideUpdateMutationFn(updateClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets', params.id] });
      navigate('/pet');
    },
    retry: false,
  }));

  const submitPet = async (petRequest: PetRequest) => {
    petMutation.mutate([params.id, petRequest]);
  };

  createEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  });

  return (
    <Show when={!petQuery.isLoading}>
      <div data-testid="page-pet-update">
        <Show when={petMutation.error ?? petQuery.error}>
          {(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}
        </Show>
        <H1>{pageTitle}</H1>
        <Show when={petQuery.data}>
          {(getPet) => (
            <PetForm getHttpError={() => petMutation.error ?? undefined} getInitialPet={getPet} submitPet={submitPet} />
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
