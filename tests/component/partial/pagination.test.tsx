/** @jsxImportSource solid-js */

import { describe, expect, test } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import { userEvent } from '@testing-library/user-event';
import { createMemoryHistory, MemoryRouter, Route, useSearchParams } from '@solidjs/router';
import { calculatePages, formatRange, Pagination } from '../../../src/component/partial/pagination';
import { formatHtml } from '../../formatter';

// labels of the links in order, current page marked with *, disabled ones with -
const links = (): Array<string> =>
  within(screen.getByRole('navigation', { name: 'Pagination' }))
    .queryAllByRole('link')
    .map(
      (link) =>
        `${link.textContent}${link.getAttribute('aria-current') === 'page' ? '*' : ''}${link.getAttribute('aria-disabled') === 'true' ? '-' : ''}`,
    );

const href = (name: string) => screen.getByRole('link', { name }).getAttribute('href');

type PagedListProps = { count?: number; maxPages?: number };

// 10 pages with 10 items each, the page is taken from the url
const PagedList = (props: PagedListProps) => {
  const [searchParams] = useSearchParams();
  const getPage = () => Number(searchParams.page ?? '1');

  return (
    <div>
      <span data-testid="page">{getPage()}</span>
      <Pagination
        getOffset={() => (getPage() - 1) * 10}
        getLimit={() => 10}
        getCount={() => props.count ?? 100}
        pageHref={(newPage) => `/list?page=${newPage}`}
        maxPages={props.maxPages}
      />
    </div>
  );
};

const renderPage = (page: number, props: PagedListProps = {}) => {
  const history = createMemoryHistory();
  history.set({ value: `/list?page=${page}`, replace: true });

  return render(() => (
    <MemoryRouter history={history}>
      <Route path="/list" component={() => <PagedList {...props} />} />
    </MemoryRouter>
  ));
};

describe('pagination', () => {
  test('formatRange', () => {
    expect(formatRange(0, 10, 0)).toBe('No results');
    expect(formatRange(0, 10, 1)).toBe('Showing 1–1 of 1');
    expect(formatRange(0, 10, 12)).toBe('Showing 1–10 of 12');
    expect(formatRange(10, 10, 12)).toBe('Showing 11–12 of 12');
  });

  test('calculatePages', () => {
    expect(calculatePages(1, 10, 1)).toEqual([]);
    expect(calculatePages(1, 1, 7)).toEqual([]);
    expect(calculatePages(11, 10, 7)).toEqual([]);
    expect(calculatePages(1, 10, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(calculatePages(4, 10, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(calculatePages(7, 10, 7)).toEqual([4, 5, 6, 7, 8, 9, 10]);
    expect(calculatePages(10, 10, 7)).toEqual([4, 5, 6, 7, 8, 9, 10]);
    expect(calculatePages(2, 3, 7)).toEqual([1, 2, 3]);
    expect(calculatePages(5, 10, 4)).toEqual([3, 4, 5, 6]);
  });

  test('current 1', async () => {
    const { container } = renderPage(1);

    await screen.findByTestId('page');

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <div>
          <span data-testid="page">1</span>
          <nav aria-label="Pagination"
            class="border-line bg-surface-muted flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <span aria-live="polite" aria-atomic="true" class="text-fg-muted text-sm">Showing 1–10 of 100</span>
            <ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
              <li>
                <a data-testid="pagination-first" href="/list?page=1" aria-label="First page" title="First page"
                  aria-disabled="true" tabindex="-1"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9 pointer-events-none opacity-40">
                  <span aria-hidden="true">«</span>
                </a>
              </li>
              <li>
                <a data-testid="pagination-previous" href="/list?page=1" aria-label="Previous page" title="Previous page"
                  aria-disabled="true" tabindex="-1"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9 pointer-events-none opacity-40">
                  <span aria-hidden="true">‹</span>
                </a>
              </li>
              <li>
                <a data-testid="pagination-page-1" href="/list?page=1" aria-label="Page 1" title="Page 1" aria-current="page"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-primary-line bg-primary font-semibold text-on-primary hover:bg-primary-hover hover:text-on-primary forced-colors:outline forced-colors:outline-2 min-w-9">
                  1</a>
              </li>
              <li>
                <a data-testid="pagination-page-2" href="/list?page=2" aria-label="Page 2" title="Page 2"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  2</a>
              </li>
              <li>
                <a data-testid="pagination-page-3" href="/list?page=3" aria-label="Page 3" title="Page 3"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  3</a>
              </li>
              <li>
                <a data-testid="pagination-page-4" href="/list?page=4" aria-label="Page 4" title="Page 4"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  4</a>
              </li>
              <li>
                <a data-testid="pagination-page-5" href="/list?page=5" aria-label="Page 5" title="Page 5"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  5</a>
              </li>
              <li>
                <a data-testid="pagination-page-6" href="/list?page=6" aria-label="Page 6" title="Page 6"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  6</a>
              </li>
              <li>
                <a data-testid="pagination-page-7" href="/list?page=7" aria-label="Page 7" title="Page 7"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  7</a>
              </li>
              <li>
                <a data-testid="pagination-next" href="/list?page=2" aria-label="Next page" title="Next page"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  <span aria-hidden="true">›</span>
                </a>
              </li>
              <li>
                <a data-testid="pagination-last" href="/list?page=10" aria-label="Last page" title="Last page"
                  class="inline-flex shrink-0 items-center justify-center gap-2 no-underline h-9 rounded-lg px-3 border border-line-control bg-surface font-medium text-fg hover:bg-surface-hover hover:text-fg min-w-9">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>"
    `);
    expect(links()).toEqual(['«-', '‹-', '1*', '2', '3', '4', '5', '6', '7', '›', '»']);
  });

  test('current 4', async () => {
    renderPage(4);

    await screen.findByTestId('page');

    expect(links()).toEqual(['«', '‹', '1', '2', '3', '4*', '5', '6', '7', '›', '»']);
  });

  test('current 7', async () => {
    renderPage(7);

    await screen.findByTestId('page');

    expect(links()).toEqual(['«', '‹', '4', '5', '6', '7*', '8', '9', '10', '›', '»']);
  });

  test('current 10', async () => {
    renderPage(10);

    await screen.findByTestId('page');

    expect(links()).toEqual(['«', '‹', '4', '5', '6', '7', '8', '9', '10*', '›-', '»-']);
  });

  test('urls', async () => {
    renderPage(7);

    await screen.findByTestId('page');

    expect(href('First page')).toBe('/list?page=1');
    expect(href('Previous page')).toBe('/list?page=6');
    expect(href('Page 9')).toBe('/list?page=9');
    expect(href('Next page')).toBe('/list?page=8');
    expect(href('Last page')).toBe('/list?page=10');
  });

  test('max pages 1, total pages 1 and no results: no links, but the range', async () => {
    const { unmount } = renderPage(1, { maxPages: 1 });

    await screen.findByTestId('page');

    expect(links()).toEqual([]);
    expect(screen.getByText('Showing 1–10 of 100')).toBeTruthy();

    unmount();

    const { unmount: unmountSecond } = renderPage(1, { count: 3 });

    await screen.findByTestId('page');

    expect(links()).toEqual([]);

    unmountSecond();

    renderPage(1, { count: 0 });

    await screen.findByTestId('page');

    expect(links()).toEqual([]);
    expect(screen.getByText('No results')).toBeTruthy();
  });

  test('the range is a polite live region', async () => {
    renderPage(1);

    const range = await screen.findByText('Showing 1–10 of 100');

    expect(range.getAttribute('aria-live')).toBe('polite');
    expect(range.getAttribute('aria-atomic')).toBe('true');
  });

  test('navigates and keeps the focus on the link', async () => {
    renderPage(8);

    await userEvent.click(await screen.findByRole('link', { name: 'Page 5' }));

    expect(screen.getByTestId('page').textContent).toBe('5');
    expect(screen.getByRole('link', { name: 'Page 5' }).getAttribute('aria-current')).toBe('page');

    await userEvent.click(screen.getByRole('link', { name: 'Last page' }));
    expect(screen.getByTestId('page').textContent).toBe('10');

    // the activated link is now disabled, but still focused (not lost to the body)
    const last = screen.getByRole('link', { name: 'Last page' });

    expect(last.getAttribute('aria-disabled')).toBe('true');
    expect(last.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(last);
  });

  test('disabled links do nothing, also via keyboard', async () => {
    // without page in the url: the disabled links point to another url (the one with page 1)
    const history = createMemoryHistory();
    history.set({ value: '/list', replace: true });

    render(() => (
      <MemoryRouter history={history}>
        <Route path="/list" component={() => <PagedList />} />
      </MemoryRouter>
    ));

    const first = await screen.findByRole('link', { name: 'First page' });

    expect(first.getAttribute('aria-disabled')).toBe('true');

    // a click by keyboard (the pointer is blocked by css)
    first.focus();
    await userEvent.keyboard('{Enter}');

    expect(history.get()).toBe('/list');

    // and they are skipped by tab
    (document.activeElement as HTMLElement).blur();
    await userEvent.tab();

    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Page 1' }));
  });
});
