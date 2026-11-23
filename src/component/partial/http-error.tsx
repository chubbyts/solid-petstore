import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import type { HttpError as HttpErrorType, InvalidParameter } from '../../client/error';
import { BadRequestOrUnprocessableEntity } from '../../client/error';

type HttpErrorProps = {
  httpError: HttpErrorType;
  // e.g. to move the focus to it (with tabIndex -1)
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  tabIndex?: number;
};

export const HttpError: Component<HttpErrorProps> = (props: HttpErrorProps) => {
  const invalidParameters = (): Array<InvalidParameter> =>
    props.httpError instanceof BadRequestOrUnprocessableEntity ? (props.httpError.invalidParameters ?? []) : [];

  return (
    <div
      ref={props.ref}
      tabIndex={props.tabIndex}
      role="alert"
      data-testid="http-error"
      class="border-danger-field-line bg-danger-field text-danger-fg flex flex-col gap-1 rounded-lg border px-3 py-2.5 text-sm"
    >
      <p class="m-0">
        <strong class="text-danger">
          {props.httpError.status ? `${props.httpError.status} ${props.httpError.title}` : props.httpError.title}
        </strong>
      </p>
      <Show when={props.httpError.detail}>
        <p class="m-0">{props.httpError.detail}</p>
      </Show>
      <Show when={props.httpError.instance}>
        <p class="m-0 font-mono text-[13px]">{props.httpError.instance}</p>
      </Show>
      <Show when={invalidParameters().length > 0}>
        <ul class="m-0 list-none p-0">
          <For each={invalidParameters()}>
            {(invalidParameter: InvalidParameter) => (
              <li>
                <strong class="text-danger font-semibold">{invalidParameter.name}</strong>: {invalidParameter.reason}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};
