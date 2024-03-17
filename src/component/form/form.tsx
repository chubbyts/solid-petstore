import type { InvalidParameter } from '../../client/error';
import type { Component, JSX } from 'solid-js';
import { For, Show } from 'solid-js';

export const FieldSet: Component<JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>> = (
  props: JSX.FieldsetHTMLAttributes<HTMLFieldSetElement>,
) => {
  return (
    <fieldset {...props} class={`mb-3 border border-gray-300 px-4 py-3 ${props.class ?? ''}`}>
      {props.children}
    </fieldset>
  );
};

export type TextFieldProps = {
  'data-testid'?: string;
  label: string;
  getValue: () => string;
  setValue: (value: string) => void;
  getInvalidParameters: () => Array<InvalidParameter>;
};

export const TextField: Component<TextFieldProps> = (props: TextFieldProps) => {
  return (
    <label class={`block ${props.getInvalidParameters().length > 0 ? 'text-red-600' : ''} `}>
      {props.label}
      <input
        data-testid={props['data-testid']}
        type="text"
        class={`mb-3 mt-2 block w-full border px-3 py-2 ${
          props.getInvalidParameters().length > 0 ? 'border-red-600 bg-red-100' : 'border-gray-300'
        }`}
        onBlur={(event) => props.setValue(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.code !== 'Enter') {
            return;
          }

          props.setValue(event.currentTarget.value);
        }}
        value={props.getValue()}
      />
      <Show when={props.getInvalidParameters().length > 0}>
        <ul class="mb-3">
          <For each={props.getInvalidParameters()}>{(invalidParameter) => <li>{invalidParameter.reason}</li>}</For>
        </ul>
      </Show>
    </label>
  );
};
