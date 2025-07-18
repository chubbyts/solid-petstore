/** @jsxImportSource solid-js */

import { render } from '@solidjs/testing-library';
import { test, expect, describe } from 'vitest';
import NotFound from '../../../src/component/page/not-found';
import { formatHtml } from '../../formatter';

describe('not-found', () => {
  test('default', async () => {
    const { container } = render(() => <NotFound />);

    expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <h1 class="mb-4 border-b border-gray-200 pb-2 text-4xl font-black ">Not Found</h1>
      </div>
    </div>"
  `);
  });
});
