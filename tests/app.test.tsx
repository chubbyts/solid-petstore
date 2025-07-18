/** @jsxImportSource solid-js */

import { test, expect, describe } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { Router } from '@solidjs/router';
import { userEvent } from '@testing-library/user-event';
import App from '../src/app';
import { formatHtml } from './formatter';

describe('app', () => {
  test('close navigation', () => {
    const { container } = render(() => <Router root={App} />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase">
          <button class="float-right block border-2 p-2 md:hidden" data-testid="navigation-toggle">
            <span class="block h-2 w-6 border-t-2"></span>
            <span class="block h-2 w-6 border-t-2"></span>
            <span class="block h-0 w-6 border-t-2"></span>
          </button>
          <a href="/" class="hover:text-gray-500 active" link="" aria-current="page">Petstore</a>
        </nav>
        <nav class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 hidden">
          <ul>
            <li>
              <a href="/pet" class="block px-4 py-2 text-gray-900 bg-gray-300 hover:bg-gray-400" link="">Pets</a>
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-16"></div>
      </div>
    </div>"
  `);
  });

  test('open navigation', async () => {
    const { container } = render(() => <Router root={App} />);

    const navigationToggle = await screen.findByTestId('navigation-toggle');

    await userEvent.click(navigationToggle);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div class="relative flex min-h-full flex-col md:flex-row">
        <nav
          class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase">
          <button class="float-right block border-2 p-2 md:hidden" data-testid="navigation-toggle">
            <span class="block h-2 w-6 border-t-2"></span>
            <span class="block h-2 w-6 border-t-2"></span>
            <span class="block h-0 w-6 border-t-2"></span>
          </button>
          <a href="/" class="hover:text-gray-500 active" link="" aria-current="page">Petstore</a>
        </nav>
        <nav class="mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 block">
          <ul>
            <li>
              <a href="/pet" class="block px-4 py-2 text-gray-900 bg-gray-300 hover:bg-gray-400" link="">Pets</a>
            </li>
          </ul>
        </nav>
        <div class="w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 mt-0"></div>
      </div>
    </div>"
  `);
  });
});
