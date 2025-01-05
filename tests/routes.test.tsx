/** @jsxImportSource solid-js */

import { test, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import type { RouteSectionProps } from '@solidjs/router';
import { Router, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import Routes from '../src/routes';
import { formatHtml } from './formatter';

vi.mock('../src/component/page/home', () => {
  return {
    default: () => <div data-testid="page-home-mock" />,
  };
});

vi.mock('../src/component/page/pet/list', () => {
  return {
    default: () => <div data-testid="page-pet-list-mock" />,
  };
});

vi.mock('../src/component/page/pet/create', () => {
  return {
    default: () => <div data-testid="page-pet-create-mock" />,
  };
});

vi.mock('../src/component/page/pet/read', () => {
  return {
    default: () => <div data-testid="page-pet-read-mock" />,
  };
});

vi.mock('../src/component/page/pet/update', () => {
  return {
    default: () => <div data-testid="page-pet-update-mock" />,
  };
});

vi.mock('../src/component/page/not-found', () => {
  return {
    default: () => <div data-testid="page-not-found-mock" />,
  };
});

test('home page', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-home-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-home-mock"></div></div>
    </div>
    "
  `);
});

test('not found', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/some-unknown-page', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-not-found-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-not-found-mock"></div></div>
    </div>
    "
  `);
});

test('pet list', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-pet-list-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-pet-list-mock"></div></div>
    </div>
    "
  `);
});

test('pet create', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/create', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-pet-create-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-pet-create-mock"></div></div>
    </div>
    "
  `);
});

test('pet read', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-pet-read-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-pet-read-mock"></div></div>
    </div>
    "
  `);
});

test('pet update', async () => {
  const App = (props: RouteSectionProps) => {
    const navigate = useNavigate();

    createEffect(() => {
      navigate('/pet/4d783b77-eb09-4603-b99b-f590b605eaa9/update', { scroll: false });
    });

    return <div>{props.children}</div>;
  };

  const { container } = render(() => (
    <Router root={App}>
      <Routes />
    </Router>
  ));

  await screen.findByTestId('page-pet-update-mock');

  expect(formatHtml(container.outerHTML)).toMatchInlineSnapshot(`
    "<div>
      <div><div data-testid="page-pet-update-mock"></div></div>
    </div>
    "
  `);
});
