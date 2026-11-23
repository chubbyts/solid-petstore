/** @jsxImportSource solid-js */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, renderHook, screen } from '@solidjs/testing-library';
import { ToastProvider, toastDuration, useToast } from '../../src/hook/use-toast';

const ShowToast = (props: { message: string }) => {
  const showToast = useToast();

  return (
    <button type="button" onClick={() => showToast(props.message)}>
      show
    </button>
  );
};

describe('use-toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('without provider', () => {
    expect(() => renderHook(useToast)).toThrow('useToast must be used within a ToastProvider');
  });

  test('shows and hides the toast', () => {
    vi.useFakeTimers();

    render(() => (
      <ToastProvider>
        <ShowToast message="Saved “Brownie” — 200 OK" />
      </ToastProvider>
    ));

    expect(screen.getByRole('status').textContent).toBe('');

    screen.getByRole('button').click();

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    vi.advanceTimersByTime(toastDuration - 1);

    // showing it again restarts the timer
    screen.getByRole('button').click();
    vi.advanceTimersByTime(toastDuration - 1);

    expect(screen.getByRole('status').textContent).toBe('Saved “Brownie” — 200 OK');

    vi.advanceTimersByTime(1);

    expect(screen.getByRole('status').textContent).toBe('');
  });
});
