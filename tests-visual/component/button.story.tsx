import type { Component } from 'solid-js';
import { For } from 'solid-js';
import type { ButtonSize, ButtonVariant } from '../../src/component/button';
import { AnchorButton, Button } from '../../src/component/button';
import { PencilIcon, TrashIcon } from '../../src/component/icon';

const variants: Array<ButtonVariant> = ['primary', 'secondary', 'danger', 'danger-outline', 'ghost', 'ghost-danger'];
const sizes: Array<ButtonSize> = ['sm', 'md', 'lg'];

export const ButtonStory: Component = () => (
  <div class="flex flex-col gap-4">
    <For each={sizes}>
      {(size) => (
        <div class="flex items-center gap-2">
          <For each={variants}>
            {(variant) => (
              <Button variant={variant} size={size}>
                {variant}
              </Button>
            )}
          </For>
          <Button variant="primary" size={size} disabled>
            disabled
          </Button>
          <Button variant="icon" size={size} aria-label="Edit">
            <PencilIcon />
          </Button>
          <Button variant="icon-danger" size={size} aria-label="Delete">
            <TrashIcon />
          </Button>
        </div>
      )}
    </For>
    <div class="flex items-center gap-2">
      <AnchorButton href="/pet" variant="primary">
        anchor primary
      </AnchorButton>
      <AnchorButton href="/pet" variant="secondary">
        anchor secondary
      </AnchorButton>
      <Button variant="ghost" size="sm">
        <PencilIcon />
        with icon
      </Button>
    </div>
  </div>
);
