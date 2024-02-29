import type { Component } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';
import { H1 } from '../heading';

const pageTitle = 'Not Found';

const NotFound: Component = () => {
  createEffect(() => {
    document.title = pageTitle;
  });

  onCleanup(() => {
    document.title = '';
  });

  return (
    <div>
      <H1>{pageTitle}</H1>
    </div>
  );
};

export default NotFound;
