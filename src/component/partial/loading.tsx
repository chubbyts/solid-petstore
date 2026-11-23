import type { Component } from 'solid-js';

// nothing visible (the page appears when loaded), but screen readers get told something is happening
export const Loading: Component = () => (
  <p role="status" data-testid="loading" class="sr-only">
    Loading…
  </p>
);
