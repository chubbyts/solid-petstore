import type { Component, JSX } from 'solid-js';
import { For, Show } from 'solid-js';
import type { InvalidParameter } from '../../client/error';
import { cx } from '../class-names';

export const inputClasses = (hasError: boolean): string =>
  cx(
    'min-w-0 rounded-lg border px-3 text-fg placeholder:text-fg-placeholder focus:border-focus',
    hasError ? 'border-danger-field-line bg-danger-field' : 'border-line-control bg-canvas',
  );

export const labelClasses = 'text-sm font-semibold';

export type FieldErrorsProps = {
  id: string;
  getInvalidParameters: () => Array<InvalidParameter>;
};

export const FieldErrors: Component<FieldErrorsProps> = (props: FieldErrorsProps) => {
  return (
    <Show when={props.getInvalidParameters().length > 0}>
      <ul id={props.id} class="text-danger m-0 list-none p-0 text-[13px]">
        <For each={props.getInvalidParameters()}>{(invalidParameter) => <li>{invalidParameter.reason}</li>}</For>
      </ul>
    </Show>
  );
};

export type TextFieldProps = {
  'data-testid'?: string;
  id: string;
  label: JSX.Element;
  getValue: () => string;
  setValue: (value: string) => void;
  getInvalidParameters: () => Array<InvalidParameter>;
  placeholder?: string;
  required?: boolean;
};

export const TextField: Component<TextFieldProps> = (props: TextFieldProps) => {
  const hasError = () => props.getInvalidParameters().length > 0;
  const errorId = () => `${props.id}-errors`;

  return (
    <div class="flex flex-col gap-1.5">
      <label for={props.id} class={labelClasses}>
        {props.label}
      </label>
      <input
        data-testid={props['data-testid']}
        id={props.id}
        type="text"
        class={cx('h-11', inputClasses(hasError()))}
        aria-required={props.required || undefined}
        aria-invalid={hasError() || undefined}
        aria-describedby={hasError() ? errorId() : undefined}
        placeholder={props.placeholder}
        value={props.getValue()}
        onInput={(e) => props.setValue(e.currentTarget.value)}
      />
      <FieldErrors id={errorId()} getInvalidParameters={props.getInvalidParameters} />
    </div>
  );
};
