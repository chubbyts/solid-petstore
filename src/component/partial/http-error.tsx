import type { Component } from 'solid-js';
import { For } from 'solid-js';
import type { HttpError as HttpErrorType, InvalidParameter } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

type HttpErrorProps = {
  httpError: HttpErrorType;
};

export const HttpError: Component<HttpErrorProps> = (props: HttpErrorProps) => {
  return (
    <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
      <p class="font-bold">{props.httpError.title}</p>
      {props.httpError.detail ? <p>{props.httpError.detail}</p> : null}
      {props.httpError.instance ? <p>{props.httpError.instance}</p> : null}
      {props.httpError instanceof BadRequestOrUnprocessableEntity && props.httpError.invalidParameters?.length ? (
        <ul>
          <For each={props.httpError.invalidParameters}>
            {(invalidParameter: InvalidParameter) => (
              <li>
                <strong>{invalidParameter.name}</strong>: {invalidParameter.reason}
              </li>
            )}
          </For>
        </ul>
      ) : null}
    </div>
  );
};
