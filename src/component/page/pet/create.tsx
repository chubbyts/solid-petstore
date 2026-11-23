import type { Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useMutation, useQueryClient } from '@tanstack/solid-query';
import { PetForm } from '../../form/pet-form';
import type { PetRequest, PetResponse } from '../../../model/pet';
import { Breadcrumb, PageHeader } from '../../heading';
import { createPetClient } from '../../../client/pet';
import type { HttpError } from '../../../client/error';
import { provideCreateMutationFn } from '../../../hook/use-query';
import { useToast } from '../../../hook/use-toast';
import { useDocumentTitle } from '../../../hook/use-document-title';
import { usePageError } from '../../../hook/use-page-error';

const pageTitle = 'New pet';

const PetCreate: Component = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showToast = useToast();

  const petMutation = useMutation<PetResponse, HttpError, PetRequest>(() => ({
    mutationFn: provideCreateMutationFn(createPetClient),
    onSuccess: (pet) => {
      showToast(`Created “${pet.name}” — 201 Created`);
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
      navigate(`/pet/${pet.id}`);
    },
    retry: false,
  }));

  const submitPet = (petRequest: PetRequest): void => {
    petMutation.mutate(petRequest);
  };

  useDocumentTitle(() => pageTitle);
  usePageError(
    () => petMutation.error,
    () => true,
  );

  return (
    <div data-testid="page-pet-create" class="flex flex-col gap-[22px]">
      <Breadcrumb items={[{ label: 'Pets', href: '/pet' }, { label: 'New' }]} />
      <PageHeader title={pageTitle} />
      <PetForm
        getHttpError={() => petMutation.error ?? undefined}
        getInitialPet={() => undefined}
        submitPet={submitPet}
        submitLabel="Create pet"
        cancelHref="/pet"
        listHref="/pet"
        getIsPending={() => petMutation.isPending}
      />
    </div>
  );
};

export default PetCreate;
