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
  const [isLoading, setLoading] = createSignal<'list' | 'create' | 'read' | 'update' | 'delete' | undefined>();
  const [getModelList, setModelList] = createSignal<MLRes | undefined>();
  const [getModel, setModel] = createSignal<MRes | undefined>();
  const [getHttpError, setHttpError] = createSignal<HttpError | undefined>();

  const listModel = async (req: MLReq) => {
    if (!listClient) {
      throw new Error('Missing listClient');
    }

    setLoading('list');

    const response = await listClient(req);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModelList(response);
    }

    setLoading(undefined);
  };

  const createModel = async (req: MReq) => {
    if (!createClient) {
      throw new Error('Missing createClient');
    }

    setLoading('create');

    const response = await createClient(req);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
    }

    setLoading(undefined);
  };

  const readModel = async (id: string) => {
    if (!readClient) {
      throw new Error('Missing readClient');
    }

    setLoading('read');

    const response = await readClient(id);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
    }

    setLoading(undefined);
  };

  const updateModel = async (id: string, req: MReq) => {
    if (!updateClient) {
      throw new Error('Missing updateClient');
    }

    setLoading('update');

    const response = await updateClient(id, req);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setModel(response);
    }

    setLoading(undefined);
  };

  const deleteModel = async (id: string) => {
    if (!deleteClient) {
      throw new Error('Missing deleteClient');
    }

    setLoading('update');

    const response = await deleteClient(id);

    if (response instanceof HttpError) {
      setHttpError(response);
    } else {
      setHttpError(undefined);
      setModel(response);
    }

    setLoading(undefined);
  };

  return {
    isLoading,
    getModelList,
    getModel,
    getHttpError,
    actions: { listModel, createModel, readModel, updateModel, deleteModel },
  };
};
