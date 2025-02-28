/** @jsxImportSource solid-js */

import { render } from '@solidjs/testing-library';
import { test, expect } from 'vitest';
import Home from '../../../src/component/page/home';
import { formatHtml } from '../../formatter';

test('default', async () => {
  const { container } = render(() => <Home />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div>
        <h1 class="mb-4 border-b pb-2 text-4xl font-black ">Home</h1>
      </div>
    </div>"
  `);
});
