import type { Component, JSX } from 'solid-js';
import { children, For, Show, splitProps } from 'solid-js';
import { A } from '@solidjs/router';
import { cx } from './class-names';

export const H1: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (
  props: JSX.HTMLAttributes<HTMLHeadingElement>,
) => {
  const [local, rest] = splitProps(props, ['class']);

  return <h1 {...rest} class={cx('m-0 text-[26px] font-bold tracking-[-0.01em] break-words', local.class)} />;
};

export type BreadcrumbItem = { label: string; href?: string };

export const Breadcrumb: Component<{ items: Array<BreadcrumbItem> }> = (props: { items: Array<BreadcrumbItem> }) => {
  return (
    <nav aria-label="Breadcrumb" class="text-fg-muted text-sm">
      <ol class="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        <For each={props.items}>
          {(item, getIndex) => (
            <li class="flex items-center gap-2">
              <Show when={getIndex() > 0}>
                <span aria-hidden="true">/</span>
              </Show>
              <Show
                when={item.href}
                fallback={
                  <span aria-current="page" class="text-fg">
                    {item.label}
                  </span>
                }
              >
                {(getHref) => (
                  <A href={getHref()} class="text-fg-muted hover:text-fg no-underline hover:underline">
                    {item.label}
                  </A>
                )}
              </Show>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
};

export type PageHeaderProps = {
  eyebrow?: JSX.Element;
  title: string;
  action?: JSX.Element;
};

export const PageHeader: Component<PageHeaderProps> = (props: PageHeaderProps) => {
  // resolved once: reading a jsx prop twice (check and render) would create its elements twice
  const eyebrow = children(() => props.eyebrow);

  return (
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div class="flex min-w-0 flex-col gap-1">
        <Show when={eyebrow()}>
          <span class="text-fg-muted text-sm">{eyebrow()}</span>
        </Show>
        <H1>{props.title}</H1>
      </div>
      {props.action}
    </header>
  );
};
