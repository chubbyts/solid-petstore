import type { Component, JSX } from 'solid-js';
import { For, Show } from 'solid-js';
import { buttonClasses } from '../button';
import { cx } from '../class-names';

// e.g. "Showing 11–12 of 12", "No results" if there is nothing to show
export const formatRange = (offset: number, limit: number, count: number): string => {
  if (count === 0) {
    return 'No results';
  }

  return `Showing ${offset + 1}–${Math.min(offset + limit, count)} of ${count}`;
};

// up to maxPages page numbers around the current page, sorted ascending
export const calculatePages = (currentPage: number, totalPages: number, maxPages: number): Array<number> => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  // oxlint-disable-next-line functional/no-let
  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      // oxlint-disable-next-line functional/immutable-data
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  // oxlint-disable-next-line functional/immutable-data
  pages.sort((a, b) => a - b);

  return pages;
};

type PageLinkProps = {
  'data-testid': string;
  href: string;
  label: string;
  current?: boolean;
  disabled?: boolean;
  children: JSX.Element;
};

// always the same element (also when disabled), so it keeps the keyboard focus when the page changes
// a plain link (handled by the router): the one of the router would set aria-current on its own
const PageLink: Component<PageLinkProps> = (props: PageLinkProps) => (
  <li>
    <a
      data-testid={props['data-testid']}
      href={props.href}
      aria-label={props.label}
      title={props.label}
      aria-current={props.current ? 'page' : undefined}
      aria-disabled={props.disabled || undefined}
      // out of the tab order when disabled, but still focusable so the focus is not lost
      tabIndex={props.disabled ? -1 : undefined}
      onClick={(e) => {
        if (props.disabled) {
          e.preventDefault();
        }
      }}
      class={cx(
        buttonClasses({ variant: props.current ? 'primary' : 'secondary', size: 'sm' }),
        // windows high contrast removes backgrounds: keep the current page recognizable
        props.current && 'forced-colors:outline forced-colors:outline-2',
        'min-w-9',
        props.disabled && 'pointer-events-none opacity-40',
      )}
    >
      {props.children}
    </a>
  </li>
);

export type PaginationProps = {
  // as returned by the list endpoints
  getOffset: () => number;
  getLimit: () => number;
  getCount: () => number;
  // url of a (1-based) page, the pages are links: they can be opened in a new tab, bookmarked and shared
  pageHref: (page: number) => string;
  // max number of page links
  maxPages?: number;
};

export const Pagination: Component<PaginationProps> = (props: PaginationProps) => {
  const getCurrentPage = () => Math.floor(props.getOffset() / props.getLimit()) + 1;
  const getTotalPages = () => Math.ceil(props.getCount() / props.getLimit());
  const getPages = () => calculatePages(getCurrentPage(), getTotalPages(), props.maxPages ?? 7);
  const isFirst = () => getCurrentPage() <= 1;
  const isLast = () => getCurrentPage() >= getTotalPages();

  return (
    <nav
      aria-label="Pagination"
      class="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
    >
      {/* announced by screen readers when the page (or filter) changes */}
      <span aria-live="polite" aria-atomic="true" class="text-fg-muted text-sm">
        {formatRange(props.getOffset(), props.getLimit(), props.getCount())}
      </span>
      <Show when={getPages().length > 0}>
        <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
          <PageLink data-testid="pagination-first" href={props.pageHref(1)} label="First page" disabled={isFirst()}>
            <span aria-hidden="true">«</span>
          </PageLink>
          <PageLink
            data-testid="pagination-previous"
            href={props.pageHref(Math.max(1, getCurrentPage() - 1))}
            label="Previous page"
            disabled={isFirst()}
          >
            <span aria-hidden="true">‹</span>
          </PageLink>
          <For each={getPages()}>
            {(page) => (
              <PageLink
                data-testid={`pagination-page-${page}`}
                href={props.pageHref(page)}
                label={`Page ${page}`}
                current={page === getCurrentPage()}
              >
                {page}
              </PageLink>
            )}
          </For>
          <PageLink
            data-testid="pagination-next"
            href={props.pageHref(Math.min(getTotalPages(), getCurrentPage() + 1))}
            label="Next page"
            disabled={isLast()}
          >
            <span aria-hidden="true">›</span>
          </PageLink>
          <PageLink
            data-testid="pagination-last"
            href={props.pageHref(getTotalPages())}
            label="Last page"
            disabled={isLast()}
          >
            <span aria-hidden="true">»</span>
          </PageLink>
        </ul>
      </Show>
    </nav>
  );
};
