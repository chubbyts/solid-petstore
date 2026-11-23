/** @jsxImportSource solid-js */

import { test, expect, describe } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Route, Router } from '@solidjs/router';
import { formatHtml } from '../formatter';
import { Breadcrumb, H1, PageHeader } from '../../src/component/heading';

describe('heading', () => {
  test('h1 with class', () => {
    const { container } = render(() => <H1 class="text-blue-600">test</H1>);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words text-blue-600">test</h1>
      </div>"
    `);
  });

  test('breadcrumb: links, the last one is the current page', async () => {
    render(() => (
      <Router>
        <Route
          path="*"
          component={() => (
            <Breadcrumb
              items={[{ label: 'Pets', href: '/pet' }, { label: 'Brownie', href: '/pet/1' }, { label: 'Edit' }]}
            />
          )}
        />
      </Router>
    ));

    const breadcrumb = await screen.findByRole('navigation', { name: 'Breadcrumb' });

    expect(breadcrumb.textContent).toBe('Pets/Brownie/Edit');
    expect(screen.getByRole('link', { name: 'Pets' }).getAttribute('href')).toBe('/pet');
    expect(screen.getByRole('link', { name: 'Brownie' }).getAttribute('href')).toBe('/pet/1');
    expect(screen.getByText('Edit').getAttribute('aria-current')).toBe('page');
  });

  test('page header without eyebrow and action', () => {
    const { container } = render(() => <PageHeader title="Pets" />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <header class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex min-w-0 flex-col gap-1">
            <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">Pets</h1>
          </div>
        </header>
      </div>"
    `);
  });

  test('page header with eyebrow and action', () => {
    const { container } = render(() => (
      <PageHeader eyebrow="Resources / Pets" title="Pets" action={<button type="button">New pet</button>} />
    ));

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <header class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex min-w-0 flex-col gap-1">
            <span class="text-fg-muted text-sm">Resources / Pets</span>
            <h1 class="m-0 text-[26px] font-bold tracking-[-0.01em] break-words">Pets</h1>
          </div>
          <button type="button">New pet</button>
        </header>
      </div>"
    `);
    // rendered once (a jsx prop read twice would create its elements twice)
    expect(screen.getAllByRole('button', { name: 'New pet' })).toHaveLength(1);
  });
});
