import { createEffect } from 'solid-js';

export const appName = 'Petstore Admin';

// the title identifies the page and the app (browser tabs, history, announced by screen readers)
export const useDocumentTitle = (getTitle: () => string): void => {
  createEffect(() => {
    // oxlint-disable-next-line functional/immutable-data
    document.title = `${getTitle()} – ${appName}`;
  });
};
