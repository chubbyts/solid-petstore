import type { Component, JSX } from 'solid-js';
import { createUniqueId, Show } from 'solid-js';
import { AnchorButton } from '../button';
import { Card, CardBody, CardFooter } from '../card';
import { PlusIcon } from '../icon';

export type ModelCardProps = {
  'data-testid'?: string;
  icon: JSX.Element;
  title: string;
  description: string;
  count?: number;
  countLabel: (count: number) => string;
  listHref: string;
  createHref?: string;
  createLabel: string;
};

export const ModelCard: Component<ModelCardProps> = (props: ModelCardProps) => {
  const titleId = createUniqueId();

  return (
    <Card data-testid={props['data-testid']} aria-labelledby={titleId}>
      <CardBody>
        <div class="flex items-center gap-3">
          <span class="bg-nav-active text-link-hover rounded-control flex size-10 shrink-0 items-center justify-center">
            {props.icon}
          </span>
          <h2 id={titleId} class="m-0 min-w-0 text-lg font-semibold">
            {props.title}
          </h2>
        </div>
        <p class="text-fg-muted m-0">{props.description}</p>
        <p class="m-0 flex items-baseline gap-2">
          <strong class="text-[26px] font-bold tracking-[-0.01em]">{props.count ?? '—'}</strong>
          <Show when={props.count !== undefined}>
            <span class="text-fg-muted">{props.countLabel(props.count as number)}</span>
          </Show>
        </p>
      </CardBody>
      <CardFooter>
        <AnchorButton
          aria-label={`View all ${props.title.toLowerCase()}`}
          href={props.listHref}
          variant="secondary"
          size="sm"
        >
          View all
        </AnchorButton>
        <Show when={props.createHref}>
          {(getCreateHref) => (
            <AnchorButton href={getCreateHref()} variant="primary" size="sm">
              <PlusIcon strokeWidth={2.2} />
              {props.createLabel}
            </AnchorButton>
          )}
        </Show>
      </CardFooter>
    </Card>
  );
};
