import { describe, expect, test } from 'vitest';
import { createModelResource } from '../../src/hook/create-model-resource';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { CreateClient, ReadClient, DeleteClient, ListClient, UpdateClient } from '../../src/client/client';
import type { ModelListRequest, ModelListResponse, ModelRequest, ModelResponse } from '../../src/model/model';
import { BadRequest } from '../../src/client/error';

describe('createModelResource', () => {
  describe('list', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.listModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing listClient]');
      }
    });

    test('error', async () => {
      const httpError = new BadRequest({ title: 'bad request' });

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [{}], return: Promise.resolve(httpError) },
      ]);

      const { getModelList, getHttpError, actions } = createModelResource({ listClient });

      expect(getModelList()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.listModel({})).toBe(false);

      expect(getModelList()).toBeUndefined();
      expect(getHttpError()).toBe(httpError);

      expect(listClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelListResponse: ModelListResponse = {
        offset: 0,
        limit: 10,
        filters: {},
        sort: {},
        count: 0,
        items: [],
        _links: {},
      };

      const [listClient, listClientMocks] = useFunctionMock<ListClient<ModelListRequest, ModelListResponse>>([
        { parameters: [{}], return: Promise.resolve(modelListResponse) },
      ]);

      const { getModelList, getHttpError, actions } = createModelResource({ listClient });

      expect(getModelList()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.listModel({})).toBe(true);

      expect(getModelList()).toBe(modelListResponse);
      expect(getHttpError()).toBeUndefined();

      expect(listClientMocks.length).toBe(0);
    });
  });

  describe('create', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.createModel({});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing createClient]');
      }
    });

    test('error', async () => {
      const httpError = new BadRequest({ title: 'bad request' });

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(httpError) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ createClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.createModel({})).toBe(false);

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBe(httpError);

      expect(createClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [createClient, createClientMocks] = useFunctionMock<CreateClient<ModelRequest, ModelResponse>>([
        { parameters: [{}], return: Promise.resolve(modelResponse) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ createClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.createModel({})).toBe(true);

      expect(getModel()).toBe(modelResponse);
      expect(getHttpError()).toBeUndefined();

      expect(createClientMocks.length).toBe(0);
    });
  });

  describe('read', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing readClient]');
      }
    });

    test('error', async () => {
      const httpError = new BadRequest({ title: 'bad request' });

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(httpError) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ readClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBe(httpError);

      expect(readClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [readClient, readClientMocks] = useFunctionMock<ReadClient<ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(modelResponse) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ readClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.readModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);

      expect(getModel()).toBe(modelResponse);
      expect(getHttpError()).toBeUndefined();

      expect(readClientMocks.length).toBe(0);
    });
  });

  describe('update', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {});
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing updateClient]');
      }
    });

    test('error', async () => {
      const httpError = new BadRequest({ title: 'bad request' });

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(httpError) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ updateClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(false);

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBe(httpError);

      expect(updateClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const modelResponse: ModelResponse = {
        id: 'ddbb7edb-8c53-4586-9844-769e1c830719',
        createdAt: '2022-06-12T20:08:24.793Z',
        _links: {},
      };

      const [updateClient, updateClientMocks] = useFunctionMock<UpdateClient<ModelRequest, ModelResponse>>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719', {}], return: Promise.resolve(modelResponse) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ updateClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.updateModel('ddbb7edb-8c53-4586-9844-769e1c830719', {})).toBe(true);

      expect(getModel()).toBe(modelResponse);
      expect(getHttpError()).toBeUndefined();

      expect(updateClientMocks.length).toBe(0);
    });
  });

  describe('delete', () => {
    test('missing client', async () => {
      const { actions } = createModelResource({});

      try {
        await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719');
        throw new Error('expect failed');
      } catch (e) {
        expect(e).toMatchInlineSnapshot('[Error: Missing deleteClient]');
      }
    });

    test('error', async () => {
      const httpError = new BadRequest({ title: 'bad request' });

      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(httpError) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ deleteClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(false);

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBe(httpError);

      expect(deleteClientMocks.length).toBe(0);
    });

    test('success', async () => {
      const [deleteClient, deleteClientMocks] = useFunctionMock<DeleteClient>([
        { parameters: ['ddbb7edb-8c53-4586-9844-769e1c830719'], return: Promise.resolve(undefined) },
      ]);

      const { getModel, getHttpError, actions } = createModelResource({ deleteClient });

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(await actions.deleteModel('ddbb7edb-8c53-4586-9844-769e1c830719')).toBe(true);

      expect(getModel()).toBeUndefined();
      expect(getHttpError()).toBeUndefined();

      expect(deleteClientMocks.length).toBe(0);
    });
  });
});
