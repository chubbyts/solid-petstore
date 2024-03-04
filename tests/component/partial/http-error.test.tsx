/** @jsxImportSource solid-js */

import { HttpError as HttpErrorPartial } from '../../../src/component/partial/http-error';
import { test, expect } from 'vitest';
import { formatHtml } from '../../formatter';
import { HttpError, BadRequestOrUnprocessableEntity } from '../../../src/client/error';
import { render } from '@solidjs/testing-library';

test('minimal', () => {
  const httpError = new HttpError({
    title: 'This is the title',
  });

  const { container } = render(() => <HttpErrorPartial httpError={httpError} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
        <p class="font-bold">This is the title</p>
      </div>
    </div>
    "
  `);
});

test('maximal', () => {
  const httpError = new BadRequestOrUnprocessableEntity({
    title: 'This is the title',
    detail: 'This is the detail',
    instance: 'This is the instance',
    invalidParameters: [{ name: 'Invalid Parameter Name', reason: 'Invalid Parameter Reason' }],
  });

  const { container } = render(() => <HttpErrorPartial httpError={httpError} />);

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div data-testid="http-error" class="mb-6 bg-red-300 px-5 py-4">
        <p class="font-bold">This is the title</p>
        <p>This is the detail</p>
        <p>This is the instance</p>
        <ul>
          <li><strong>Invalid Parameter Name</strong>: Invalid Parameter Reason</li>
        </ul>
      </div>
    </div>
    "
  `);
});
