import type { Component, JSX } from 'solid-js';
import { Show, splitProps } from 'solid-js';
import { DateTime } from './date-time';
import { cx } from './class-names';

type DivProps = JSX.HTMLAttributes<HTMLDivElement>;

export const cardClasses = 'flex flex-col rounded-xl border border-line bg-surface';

export const Card: Component<JSX.HTMLAttributes<HTMLElement>> = (props: JSX.HTMLAttributes<HTMLElement>) => {
  const [local, rest] = splitProps(props, ['class']);

  return <section {...rest} class={cx(cardClasses, local.class)} />;
};

// cards use 18px (4.5) spacing all around: body, footer text and footer buttons
export const CardBody: Component<DivProps> = (props: DivProps) => {
  const [local, rest] = splitProps(props, ['class']);

  return <div {...rest} class={cx('flex flex-col gap-5 p-4.5', local.class)} />;
};

export const CardFooter: Component<DivProps> = (props: DivProps) => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <div
      {...rest}
      class={cx(
        'border-line bg-surface-muted flex flex-wrap items-center gap-2 rounded-b-xl border-t p-4.5',
        local.class,
      )}
    />
  );
};

export type MetaProps = { id: string; createdAt: string; updatedAt?: string | null };

export const Meta: Component<MetaProps> = (props: MetaProps) => {
  return (
    // 3 × 14px lines + 2 × 1px gaps = 44px, the height of the footer buttons, so both get the same spacing
    <div class="text-fg-muted flex min-w-0 flex-col gap-px text-[13px] leading-4">
      <span class="break-all">ID: {props.id}</span>
      <span>
        Created: <DateTime value={props.createdAt} />
      </span>
      <span>
        Last updated:{' '}
        <Show when={props.updatedAt} fallback="Never">
          {(getUpdatedAt) => <DateTime value={getUpdatedAt()} />}
        </Show>
      </span>
    </div>
  );
};
