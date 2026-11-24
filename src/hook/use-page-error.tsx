import type { ParentComponent } from 'solid-js';
import { createContext, createEffect, createSignal, onCleanup, untrack, useContext } from 'solid-js';
import type { HttpError } from '../client/error';

export type PageHttpError = {
  httpError: HttpError;
  // true for errors of actions (e.g. save, delete): the focus moves to the error, so it's noticed
  focus: boolean;
};

type PageErrorContextValue = {
  getPageError: () => PageHttpError | undefined;
  setPageError: (pageError: PageHttpError | undefined) => void;
};

const PageErrorContext = createContext<PageErrorContextValue>();

export const PageErrorProvider: ParentComponent = (props) => {
  const [getPageError, setPageError] = createSignal<PageHttpError | undefined>(undefined);

  return (
    <PageErrorContext.Provider value={{ getPageError, setPageError: (pageError) => setPageError(pageError) }}>
      {props.children}
    </PageErrorContext.Provider>
  );
};

const usePageErrorContext = (): PageErrorContextValue => {
  const context = useContext(PageErrorContext);

  if (!context) {
    throw new Error('usePageError must be used within a PageErrorProvider');
  }

  return context;
};

// reports the error of the current page, shown in one place on top of the content (see PageError),
// cleared when it's gone or the page is left
export const usePageError = (
  getHttpError: () => HttpError | null | undefined,
  getFocus: () => boolean = () => false,
): void => {
  const { getPageError, setPageError } = usePageErrorContext();

  createEffect(() => {
    const httpError = getHttpError();
    const pageError = httpError ? { httpError, focus: getFocus() } : undefined;

    setPageError(pageError);

    // only the own one: the next page may have reported its error already
    onCleanup(() => {
      if (pageError && untrack(getPageError) === pageError) {
        setPageError(undefined);
      }
    });
  });
};

export const useCurrentPageError = (): (() => PageHttpError | undefined) => usePageErrorContext().getPageError;
