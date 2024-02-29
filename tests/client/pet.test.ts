import { ListPets, CreatePet, ReadPet, UpdatePet, DeletePet } from '../../src/client/pet';
import fetchMock from 'fetch-mock';
import { describe, test, expect, beforeEach } from 'vitest';
import type { PetListRequest, PetListResponse, PetRequest, PetResponse } from '../../src/model/pet';
import { BadRequest, InternalServerError, NetworkError, NotFound, UnprocessableEntity } from '../../src/client/error';

beforeEach(() => {
  fetchMock.restore();
});

describe('Pet List', () => {
  test('success', async () => {
    const petListRequest: PetListRequest = { sort: { name: 'asc' } };
    const petListResponse: PetListResponse = {
      offset: 0,
      limit: 20,
      filters: {},
      sort: {},
      count: 1,
      items: [
        {
          id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
          createdAt: '2022-06-12T20:08:24.793Z',
          name: 'Brownie',
          vaccinations: [],
          _links: {},
        },
      ],
      ...petListRequest,
      _links: {},
    };

    fetchMock.get(
      'https://petstore.test/api/pets?sort%5Bname%5D=asc',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: petListResponse,
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ListPets(petListRequest)) as PetListResponse;

    expect(response).toHaveProperty('offset');
    expect(response.offset).toEqual(0);

    expect(response).toHaveProperty('limit');
    expect(response.limit).toEqual(20);

    expect(response).toHaveProperty('count');
    expect(response.count).toEqual(1);
  });

  test('bad request', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets?sort%5Bname%5D=asc',
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Bad Request',
          detail: 'Sorting value',
          instance: '0123456789abcdef',
          invalidParameters: [{ name: 'name', reason: 'unknown field', details: { key: 'value1' } }],
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ListPets({ sort: { name: 'asc' } })) as BadRequest;

    expect(response).toBeInstanceOf(BadRequest);

    expect(response.title).toEqual('Bad Request');
    expect(response.detail).toEqual('Sorting value');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('internal server error', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets?sort%5Bname%5D=asc',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Internal Server Error',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ListPets({ sort: { name: 'asc' } })) as InternalServerError;

    expect(response).toBeInstanceOf(InternalServerError);

    expect(response.title).toEqual('Internal Server Error');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('network error', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets?sort%5Bname%5D=asc',
      {
        throws: new TypeError('Failed to fetch'),
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ListPets({ sort: { name: 'asc' } })) as NetworkError;

    expect(response).toBeInstanceOf(NetworkError);

    expect(response.title).toEqual('Failed to fetch');
  });

  test('unknown response', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets?sort%5Bname%5D=asc',
      {
        status: 418,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    expect.assertions(1);

    await expect(ListPets({ sort: { name: 'asc' } })).rejects.toThrow(new Error('Unknown response'));
  });
});

describe('Pet Create', () => {
  test('success', async () => {
    const petRequest: PetRequest = { name: 'Brownie', vaccinations: [] };
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      ...petRequest,
      _links: {},
    };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
        body: petResponse,
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(petRequest)),
      },
    );

    const response = (await CreatePet(petRequest)) as PetResponse;

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
    expect(response).toHaveProperty('name');
    expect(response.name).toEqual('Brownie');
  });

  test('bad request', async () => {
    const pet: PetRequest = { name: '', vaccinations: [] };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Bad Request',
          detail: 'name',
          instance: '0123456789abcdef',
          invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await CreatePet(pet)) as BadRequest;

    expect(response).toBeInstanceOf(BadRequest);

    expect(response.title).toEqual('Bad Request');
    expect(response.detail).toEqual('name');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('unprocessable entity', async () => {
    const pet: PetRequest = { name: '', vaccinations: [] };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Unprocessable Entity',
          detail: 'name',
          instance: '0123456789abcdef',
          invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await CreatePet(pet)) as UnprocessableEntity;

    expect(response).toBeInstanceOf(UnprocessableEntity);

    expect(response.title).toEqual('Unprocessable Entity');
    expect(response.detail).toEqual('name');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('internal server error', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Internal Server Error',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await CreatePet(pet)) as InternalServerError;

    expect(response).toBeInstanceOf(InternalServerError);

    expect(response.title).toEqual('Internal Server Error');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('network error', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        throws: new TypeError('Failed to fetch'),
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await CreatePet(pet)) as NetworkError;

    expect(response).toBeInstanceOf(NetworkError);

    expect(response.title).toEqual('Failed to fetch');
  });

  test('unknown response', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.post(
      'https://petstore.test/api/pets',
      {
        status: 418,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    expect.assertions(1);

    await expect(CreatePet(pet)).rejects.toThrow(new Error('Unknown response'));
  });
});

describe('Pet Read', () => {
  test('success', async () => {
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      name: 'Brownie',
      vaccinations: [],
      _links: {},
    };

    fetchMock.get(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: petResponse,
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as PetResponse;

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
    expect(response).toHaveProperty('name');
    expect(response.name).toEqual('Brownie');
  });

  test('not found', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Not Found',
          detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as NotFound;

    expect(response).toBeInstanceOf(NotFound);

    expect(response.title).toEqual('Not Found');
    expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('internal server error', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Internal Server Error',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as InternalServerError;

    expect(response).toBeInstanceOf(InternalServerError);

    expect(response.title).toEqual('Internal Server Error');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('network error', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        throws: new TypeError('Failed to fetch'),
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as NetworkError;

    expect(response).toBeInstanceOf(NetworkError);

    expect(response.title).toEqual('Failed to fetch');
  });

  test('unknown response', async () => {
    fetchMock.get(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 418,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    expect.assertions(1);

    await expect(ReadPet('4d783b77-eb09-4603-b99b-f590b605eaa9')).rejects.toThrow(new Error('Unknown response'));
  });
});

describe('Pet Update', () => {
  test('success', async () => {
    const petRequest: PetRequest = { name: 'Brownie', vaccinations: [] };
    const petResponse: PetResponse = {
      id: '4d783b77-eb09-4603-b99b-f590b605eaa9',
      createdAt: '2022-06-12T20:08:24.793Z',
      updatedAt: '2022-06-12T20:08:24.793Z',
      ...petRequest,
      _links: {},
    };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: petResponse,
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(petRequest)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', petRequest)) as PetResponse;

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual('4d783b77-eb09-4603-b99b-f590b605eaa9');
    expect(response).toHaveProperty('name');
    expect(response.name).toEqual('Brownie');
  });

  test('bad request', async () => {
    const pet: PetRequest = { name: '', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Bad Request',
          detail: 'name',
          instance: '0123456789abcdef',
          invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)) as BadRequest;

    expect(response).toBeInstanceOf(BadRequest);

    expect(response.title).toEqual('Bad Request');
    expect(response.detail).toEqual('name');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('not found', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Not Found',
          detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)) as NotFound;

    expect(response).toBeInstanceOf(NotFound);

    expect(response.title).toEqual('Not Found');
    expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('unprocessable entity', async () => {
    const pet: PetRequest = { name: '', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Unprocessable Entity',
          detail: 'name',
          instance: '0123456789abcdef',
          invalidParameters: [{ name: 'name', reason: 'empty', details: { key: 'value1' } }],
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)) as UnprocessableEntity;

    expect(response).toBeInstanceOf(UnprocessableEntity);

    expect(response.title).toEqual('Unprocessable Entity');
    expect(response.detail).toEqual('name');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('internal server error', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Internal Server Error',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)) as InternalServerError;

    expect(response).toBeInstanceOf(InternalServerError);

    expect(response.title).toEqual('Internal Server Error');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('network error', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        throws: new TypeError('Failed to fetch'),
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    const response = (await UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)) as NetworkError;

    expect(response).toBeInstanceOf(NetworkError);

    expect(response.title).toEqual('Failed to fetch');
  });

  test('unknown response', async () => {
    const pet: PetRequest = { name: 'Brownie', vaccinations: [] };

    fetchMock.put(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 418,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
        body: JSON.parse(JSON.stringify(pet)),
      },
    );

    expect.assertions(1);

    await expect(UpdatePet('4d783b77-eb09-4603-b99b-f590b605eaa9', pet)).rejects.toThrow(new Error('Unknown response'));
  });
});

describe('delete pet', () => {
  test('success', async () => {
    fetchMock.delete(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 204,
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9');
  });

  test('not found', async () => {
    fetchMock.delete(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Not Found',
          detail: 'There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as NotFound;

    expect(response).toBeInstanceOf(NotFound);

    expect(response.title).toEqual('Not Found');
    expect(response.detail).toEqual('There is no pet with id "4d783b77-eb09-4603-b99b-f590b605eaa9"');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('internal server error', async () => {
    fetchMock.delete(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          title: 'Internal Server Error',
          instance: '0123456789abcdef',
        },
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as InternalServerError;

    expect(response).toBeInstanceOf(InternalServerError);

    expect(response.title).toEqual('Internal Server Error');
    expect(response.instance).toEqual('0123456789abcdef');
  });

  test('network error', async () => {
    fetchMock.delete(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        throws: new TypeError('Failed to fetch'),
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = (await DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9')) as NetworkError;

    expect(response).toBeInstanceOf(NetworkError);

    expect(response.title).toEqual('Failed to fetch');
  });

  test('unknown response', async () => {
    fetchMock.delete(
      'https://petstore.test/api/pets/4d783b77-eb09-4603-b99b-f590b605eaa9',
      {
        status: 418,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      },
      {
        delay: 10,
        headers: {
          Accept: 'application/json',
        },
      },
    );

    expect.assertions(1);

    await expect(DeletePet('4d783b77-eb09-4603-b99b-f590b605eaa9')).rejects.toThrow(new Error('Unknown response'));
  });
});
