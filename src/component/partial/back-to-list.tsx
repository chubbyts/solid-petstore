import type { Component } from 'solid-js';
import { AnchorButton } from '../button';
import { ArrowLeftIcon } from '../icon';

export const BackToList: Component<{ href: string }> = (props: { href: string }) => (
  <AnchorButton data-testid="back-to-list" href={props.href} variant="secondary">
    <ArrowLeftIcon />
    Back to list
  </AnchorButton>
);
