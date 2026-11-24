import type { Component } from 'solid-js';
import { createEffect, createMemo, Show } from 'solid-js';
import type { HttpError } from '../../client/error';
import { NetworkError, Unauthorized } from '../../client/error';
import { useCurrentPageError } from '../../hook/use-page-error';
import { HttpError as HttpErrorPartial } from './http-error';

// errors of the page that are most likely caused by an authentication error, and would only repeat it
const isConsequenceOfAuthenticationError = (httpError: HttpError): boolean =>
  httpError instanceof Unauthorized || httpError instanceof NetworkError;

export type PageErrorProps = {
  // e.g. authentication failed: shown first, the error of the page is only shown if it's not caused by it
  httpError?: HttpError;
};

// the errors in one place: on top of the content
export const PageError: Component<PageErrorProps> = (props: PageErrorProps) => {
  const getCurrentPageError = useCurrentPageError();

  const getPageError = createMemo(() => {
    const currentPageError = getCurrentPageError();

    return currentPageError && !(props.httpError && isConsequenceOfAuthenticationError(currentPageError.httpError))
      ? currentPageError
      : undefined;
  });

  // oxlint-disable-next-line functional/no-let
  let pageErrorRef: HTMLDivElement | undefined;

  // errors of actions (e.g. save) get the focus (and are scrolled into view), so they're noticed,
  // unless the focus is on an invalid field already (moved there by the form)
  createEffect(() => {
    if (getPageError()?.focus && !document.activeElement?.matches('[aria-invalid="true"]')) {
      pageErrorRef?.focus();
    }
  });

  return (
    <>
      <Show when={props.httpError}>{(getHttpError) => <HttpErrorPartial httpError={getHttpError()} />}</Show>
      <Show when={getPageError()}>
        {(getCurrentError) => (
          <HttpErrorPartial
            ref={(el) => (pageErrorRef = el)}
            // focusable by script only, not in the tab order: it's not interactive
            tabIndex={getCurrentError().focus ? -1 : undefined}
            httpError={getCurrentError().httpError}
          />
        )}
      </Show>
    </>
  );
};
