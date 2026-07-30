/** @jsxImportSource solid-js */

import { test, expect, describe } from 'vitest';
import { render } from '@solidjs/testing-library';
import { formatHtml } from '../formatter';
import { H1 } from '../../src/component/heading';

describe('heading', () => {
  test('h1 with class', () => {
    const { container } = render(() => <H1 class="text-blue-600">test</H1>);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
      "<div>
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black text-blue-600">test</h1>
      </div>"
    `);
  });
});
