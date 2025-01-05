import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { H1 } from '../heading';

const pageTitle = 'Not Found';

const NotFound: Component = () => {
  createEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    document.title = pageTitle;
  });

  return (
    <div>
      <H1>{pageTitle}</H1>
    </div>
  );
};

export default NotFound;
