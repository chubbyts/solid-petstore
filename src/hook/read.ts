import { useQuery } from '@tanstack/solid-query';
import { HttpError } from '../client/error';
import type { ReadClient } from '../client/client';
import type { ModelResponse } from '../model/model';

export const useReadQuery = <MR extends ModelResponse>(readClient: ReadClient<MR>, type: string, id: string) => {
  return useQuery<MR, HttpError>(() => ({
    queryKey: [type, id],
    queryFn: async () => {
      const response = await readClient(id);

      if (response instanceof HttpError) {
        throw response;
      }

      return response;
    },
    retry: false,
  }));
};
