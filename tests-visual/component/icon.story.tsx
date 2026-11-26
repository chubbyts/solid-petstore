import type { Component } from 'solid-js';
import { For } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  ArrowLeftIcon,
  EyeIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PawIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  TrashIcon,
} from '../../src/component/icon';

const icons = [
  PawIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  LogOutIcon,
];

export const IconStory: Component = () => (
  <div class="flex flex-col gap-4">
    <For each={[16, 24, 32]}>
      {(size) => (
        <div class="flex gap-4">
          <For each={icons}>{(icon) => <Dynamic component={icon} size={size} />}</For>
        </div>
      )}
    </For>
    <div class="text-link flex gap-4">
      <For each={icons}>{(icon) => <Dynamic component={icon} size={24} strokeWidth={1} />}</For>
    </div>
  </div>
);
