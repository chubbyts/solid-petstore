import { createSignal } from 'solid-js';
import { HttpError } from '../client/error';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../model/model';
import type { CreateClient, DeleteClient, ListClient, ReadClient, UpdateClient } from '../client/client';

export const createModelResource = <
  MLReq extends ModelListRequest,
  MLRes extends ModelListResponse,
  MReq extends ModelRequest,
  MRes extends ModelResponse,
>({
  listClient,
  createClient,
  readClient,
  updateClient,
  deleteClient,
}: {
  listClient?: ListClient<MLReq, MLRes>;
  createClient?: CreateClient<MReq, MRes>;
  readClient?: ReadClient<MRes>;
  updateClient?: UpdateClient<MReq, MRes>;
  deleteClient?: DeleteClient;
}) => {
  const [isLoading, setIsLoading] = createSignal<'list' | 'create' | 'read' | 'update' | 'delete' | undefined>();
  const [getModelList, setModelList] = createSignal<MLRes | undefined>();
  const [getModel, setModel] = createSignal<MRes | undefined>();
  const [getHttpError, setHttpError] = createSignal<HttpError | undefined>();

  const listModel = async (req: MLReq): Promise<boolean> => {
    if (!listClient) {
      throw new Error('Missing listClient');
    }

    setIsLoading('list');

    const response = await listClient(req);

    // eslint-disable-next-line functional/no-let
    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModelList(response);
      success = true;
    }

    setIsLoading(undefined);

    return success;
  };

  const createModel = async (req: MReq): Promise<boolean> => {
    if (!createClient) {
      throw new Error('Missing createClient');
    }

    setIsLoading('create');

    const response = await createClient(req);

    // eslint-disable-next-line functional/no-let
    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setIsLoading(undefined);

    return success;
  };

  const readModel = async (id: string): Promise<boolean> => {
    if (!readClient) {
      throw new Error('Missing readClient');
    }

    setIsLoading('read');

    const response = await readClient(id);

    // eslint-disable-next-line functional/no-let
    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setIsLoading(undefined);

    return success;
  };

  const updateModel = async (id: string, req: MReq): Promise<boolean> => {
    if (!updateClient) {
      throw new Error('Missing updateClient');
    }

    setIsLoading('update');

    const response = await updateClient(id, req);

    // eslint-disable-next-line functional/no-let
    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
      success = true;
    }

    setIsLoading(undefined);

    return success;
  };

  const deleteModel = async (id: string): Promise<boolean> => {
    if (!deleteClient) {
      throw new Error('Missing deleteClient');
    }

    setIsLoading('delete');

    const response = await deleteClient(id);

    // eslint-disable-next-line functional/no-let
    let success: boolean;

    if (response instanceof HttpError) {
      setHttpError(response);
      success = false;
    } else {
      setHttpError(undefined);
      setModel(undefined);
      success = true;
    }

    setIsLoading(undefined);

    return success;
  };

  return {
    isLoading,
    getModelList,
    getModel,
    getHttpError,
    actions: { listModel, createModel, readModel, updateModel, deleteModel },
  };
};
