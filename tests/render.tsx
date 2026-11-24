/** @jsxImportSource solid-js */

import type { Component, JSX } from 'solid-js';
import { render } from '@solidjs/testing-library';
import { createMemoryHistory, MemoryRouter, Route } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { ToastProvider } from '../src/hook/use-toast';
import { PageErrorProvider } from '../src/hook/use-page-error';
import { PageError } from '../src/component/partial/page-error';

export const renderRoute = ({
  path,
  url,
  component,
  routes,
}: {
  path: string;
  // several: the history, the last one is the current
  url: string | Array<string>;
  component: Component;
  routes?: JSX.Element;
}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const history = createMemoryHistory();

  (Array.isArray(url) ? url : [url]).forEach((value, i) => history.set({ value, replace: i === 0 }));

  return {
    queryClient,
    history,
    ...render(() => (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {/* like in the app: the error of the page is shown on top of it */}
          <PageErrorProvider>
            <PageError />
            <MemoryRouter history={history}>
              <Route path={path} component={component} />
              {routes}
            </MemoryRouter>
          </PageErrorProvider>
        </ToastProvider>
      </QueryClientProvider>
    )),
  };
};
