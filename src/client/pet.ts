import type { PetListResponse, PetRequest, PetResponse, PetListRequest } from '../model/pet';
import { petListResponseSchema, petResponseSchema } from '../model/pet';
import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';
import type { HttpError } from './error';
import { BadRequest, InternalServerError, NetworkError, NotFound, UnprocessableEntity } from './error';
import qs from 'qs';

const url = `${import.meta.env.VITE_PETSTORE_URL}/api/pets`;

export const ListPets = async (petListRequest: PetListRequest): Promise<HttpError | PetListResponse> => {
  try {
    const response: Response = await fetch(`${url}?${qs.stringify(petListRequest)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();

    if (200 === response.status) {
      return petListResponseSchema.parse(json);
    }

    if (400 === response.status) {
      return new BadRequest({ ...json });
    }

    if (500 === response.status) {
      return new InternalServerError({ ...json });
    }
  } catch (error) {
    return new NetworkError({ title: throwableToError(error).message });
  }

  throw new Error('Unknown response');
};

export const CreatePet = async (petRequest: PetRequest): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petRequest),
    });

    const json = await response.json();

    if (201 === response.status) {
      return petResponseSchema.parse(json);
    }

    if (400 === response.status) {
      return new BadRequest({ ...json });
    }

    if (422 === response.status) {
      return new UnprocessableEntity({ ...json });
    }

    if (500 === response.status) {
      return new InternalServerError({ ...json });
    }
  } catch (error) {
    return new NetworkError({ title: throwableToError(error).message });
  }

  throw new Error('Unknown response');
};

export const ReadPet = async (id: string): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(`${url}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();

    if (200 === response.status) {
      return petResponseSchema.parse(json);
    }

    if (404 === response.status) {
      return new NotFound({ ...json });
    }

    if (500 === response.status) {
      return new InternalServerError({ ...json });
    }
  } catch (error) {
    return new NetworkError({ title: throwableToError(error).message });
  }

  throw new Error('Unknown response');
};

export const UpdatePet = async (id: string, petRequest: PetRequest): Promise<HttpError | PetResponse> => {
  try {
    const response: Response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petRequest),
    });

    const json = await response.json();

    if (200 === response.status) {
      return petResponseSchema.parse(json);
    }

    if (400 === response.status) {
      return new BadRequest({ ...json });
    }

    if (404 === response.status) {
      return new NotFound({ ...json });
    }

    if (422 === response.status) {
      return new UnprocessableEntity({ ...json });
    }

    if (500 === response.status) {
      return new InternalServerError({ ...json });
    }
  } catch (error) {
    return new NetworkError({ title: throwableToError(error).message });
  }

  throw new Error('Unknown response');
};

export const DeletePet = async (id: string): Promise<HttpError | PetResponse | undefined> => {
  try {
    const response: Response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });

    if (204 === response.status) {
      return;
    }

    const json = await response.json();

    if (404 === response.status) {
      return new NotFound({ ...json });
    }

    if (500 === response.status) {
      return new InternalServerError({ ...json });
    }
  } catch (error) {
    return new NetworkError({ title: throwableToError(error).message });
  }

  throw new Error('Unknown response');
};
