import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { H1 } from '../heading';

const pageTitle = 'Home';

const Home: Component = () => {
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

export default Home;
