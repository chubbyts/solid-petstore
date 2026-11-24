/** @jsxImportSource solid-js */

import { describe, expect, test } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { createEffect, createSignal, on } from 'solid-js';
import { BadRequest, HttpError, InternalServerError, NetworkError, Unauthorized } from '../../../src/client/error';
import type { HttpError as HttpErrorType } from '../../../src/client/error';
import { PageError } from '../../../src/component/partial/page-error';
import { PageErrorProvider, usePageError } from '../../../src/hook/use-page-error';

const authenticationError = new HttpError({ title: 'Authentication failed', detail: 'Failed to fetch' });

type PageProps = {
  httpError?: HttpErrorType;
  focus?: boolean;
};

const Page = (props: PageProps) => {
  usePageError(
    () => props.httpError,
    () => props.focus ?? false,
  );

  return null;
};

const renderPageError = (props: PageProps & { pageHttpError?: HttpErrorType }) =>
  render(() => (
    <PageErrorProvider>
      <PageError httpError={props.httpError} />
      <Page httpError={props.pageHttpError} focus={props.focus} />
    </PageErrorProvider>
  ));

const errorTexts = () => screen.queryAllByTestId('http-error').map((element) => element.textContent);

describe('page-error', () => {
  test('without error', () => {
    renderPageError({});

    expect(errorTexts()).toEqual([]);
  });

  test('error of the page', () => {
    renderPageError({
      pageHttpError: new BadRequest({ title: 'Bad Request', invalidParameters: [{ name: 'name', reason: 'empty' }] }),
    });

    expect(errorTexts()).toEqual(['400 Bad Requestname: empty']);

    // not focusable, the focus stays where it is (e.g. a page that couldn't be loaded)
    const error = screen.getByTestId('http-error');
    expect(error.hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).not.toBe(error);
  });

  test('given error only', () => {
    renderPageError({ httpError: authenticationError });

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch']);
  });

  test.each([
    ['network error', new NetworkError({ title: 'Failed to fetch' })],
    ['unauthorized', new Unauthorized({ title: 'Unauthorized' })],
  ])('given error hides the error of the page caused by it: %s', (_, pageHttpError) => {
    renderPageError({ httpError: authenticationError, pageHttpError, focus: true });

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch']);
  });

  test('given error first, followed by the error of the page not caused by it', () => {
    renderPageError({
      httpError: authenticationError,
      pageHttpError: new InternalServerError({ title: 'Internal Server Error' }),
    });

    expect(errorTexts()).toEqual(['Authentication failedFailed to fetch', '500 Internal Server Error']);
  });

  test('error of an action gets the focus', () => {
    renderPageError({ pageHttpError: new InternalServerError({ title: 'Internal Server Error' }), focus: true });

    const error = screen.getByTestId('http-error');
    expect(error.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(error);
  });

  test('error of an action does not take the focus from an invalid field', () => {
    const [getHttpError, setHttpError] = createSignal<HttpErrorType | undefined>(undefined);

    // like a form: after a failed save, it focuses the first invalid field
    const Form = () => {
      // oxlint-disable-next-line functional/no-let
      let input: HTMLInputElement | undefined;

      usePageError(getHttpError, () => true);

      createEffect(
        on(getHttpError, (httpError) => {
          if (httpError) {
            input?.focus();
          }
        }),
      );

      return <input aria-label="Name" aria-invalid={getHttpError() ? 'true' : undefined} ref={(el) => (input = el)} />;
    };

    render(() => (
      <PageErrorProvider>
        <PageError />
        <Form />
      </PageErrorProvider>
    ));

    setHttpError(new BadRequest({ title: 'Bad Request', invalidParameters: [{ name: 'name', reason: 'empty' }] }));

    expect(errorTexts()).toEqual(['400 Bad Requestname: empty']);
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' }));
  });

  test('error of an action reported later gets the focus', () => {
    const [getHttpError, setHttpError] = createSignal<HttpErrorType | undefined>(undefined);

    const Form = () => {
      usePageError(getHttpError, () => true);

      return <input aria-label="Name" />;
    };

    render(() => (
      <PageErrorProvider>
        <PageError />
        <Form />
      </PageErrorProvider>
    ));

    screen.getByRole('textbox', { name: 'Name' }).focus();

    setHttpError(new InternalServerError({ title: 'Internal Server Error' }));

    expect(document.activeElement).toBe(screen.getByTestId('http-error'));
  });
});
