/** @jsxImportSource solid-js */

import { describe, expect, test } from 'vitest';
import { render, renderHook, screen } from '@solidjs/testing-library';
import { createSignal, Show } from 'solid-js';
import { userEvent } from '@testing-library/user-event';
import { BadRequest, NetworkError } from '../../src/client/error';
import type { HttpError } from '../../src/client/error';
import { PageErrorProvider, useCurrentPageError, usePageError } from '../../src/hook/use-page-error';

const CurrentPageError = () => {
  const getPageError = useCurrentPageError();

  return (
    <span data-testid="current">
      {getPageError() ? `${getPageError()?.httpError.title} ${String(getPageError()?.focus)}` : 'none'}
    </span>
  );
};

type PageProps = { getHttpError: () => HttpError | undefined; getFocus?: () => boolean };

const Page = (props: PageProps) => {
  usePageError(props.getHttpError, props.getFocus);

  return null;
};

const renderApp = () => {
  const [getHttpError, setHttpError] = createSignal<HttpError | undefined>(undefined);
  const [getFocus, setFocus] = createSignal<boolean>(false);
  const [getShowPage, setShowPage] = createSignal<boolean>(true);

  render(() => (
    <PageErrorProvider>
      <CurrentPageError />
      <Show when={getShowPage()}>
        <Page getHttpError={getHttpError} getFocus={getFocus} />
      </Show>
      <button onClick={() => setShowPage(false)}>leave</button>
    </PageErrorProvider>
  ));

  return { setHttpError, setFocus };
};

describe('use-page-error', () => {
  test('without provider', () => {
    expect(() => renderHook(() => usePageError(() => undefined))).toThrow(
      'usePageError must be used within a PageErrorProvider',
    );
    expect(() => renderHook(useCurrentPageError)).toThrow('usePageError must be used within a PageErrorProvider');
  });

  test('without error', () => {
    renderApp();

    expect(screen.getByTestId('current').textContent).toBe('none');
  });

  test('default: no focus', () => {
    render(() => (
      <PageErrorProvider>
        <CurrentPageError />
        <Page getHttpError={() => new NetworkError({ title: 'Failed to fetch' })} />
      </PageErrorProvider>
    ));

    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');
  });

  test('reports the error, replaces it and clears it when the page is left', async () => {
    const { setHttpError, setFocus } = renderApp();

    setHttpError(new NetworkError({ title: 'Failed to fetch' }));

    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    setHttpError(new BadRequest({ title: 'Bad Request' }));
    setFocus(true);

    expect(screen.getByTestId('current').textContent).toBe('Bad Request true');

    setHttpError(undefined);
    setFocus(false);

    expect(screen.getByTestId('current').textContent).toBe('none');

    setHttpError(new NetworkError({ title: 'Failed to fetch' }));

    expect(screen.getByTestId('current').textContent).toBe('Failed to fetch false');

    await userEvent.click(screen.getByRole('button', { name: 'leave' }));

    expect(screen.getByTestId('current').textContent).toBe('none');
  });

  test('leaving a page does not clear the error of the next one', () => {
    const [getPage, setPage] = createSignal<'first' | 'second'>('first');

    render(() => (
      <PageErrorProvider>
        <CurrentPageError />
        <Show when={getPage() === 'first'}>
          <Page getHttpError={() => new NetworkError({ title: 'First' })} />
        </Show>
        <Show when={getPage() === 'second'}>
          <Page getHttpError={() => new NetworkError({ title: 'Second' })} />
        </Show>
      </PageErrorProvider>
    ));

    expect(screen.getByTestId('current').textContent).toBe('First false');

    setPage('second');

    expect(screen.getByTestId('current').textContent).toBe('Second false');
  });
});
