import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import { useToast } from '../../src/hook/use-toast';

// rendered into the body (portal): see the whole page
export const ToastStory: Component = () => {
  const showToast = useToast();

  onMount(() => showToast('Created “Brownie” — 201 Created'));

  return <p class="m-0">The page behind the toast.</p>;
};
