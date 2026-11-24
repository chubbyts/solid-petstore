import type { ParentComponent } from 'solid-js';
import { createContext, createEffect, createSignal, onCleanup, Show, useContext } from 'solid-js';
import { Portal } from 'solid-js/web';

export type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast>();

// long enough to read a short message (also for slower readers)
export const toastDuration = 5000;

export const ToastProvider: ParentComponent = (props) => {
  // wrapped in an object so showing the same message twice restarts the timer
  const [getToast, setToast] = createSignal<{ message: string } | undefined>(undefined);

  createEffect(() => {
    if (!getToast()) {
      return;
    }

    const timeout = setTimeout(() => setToast(undefined), toastDuration);

    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <ToastContext.Provider value={(message: string) => setToast({ message })}>
      {props.children}
      {/* outside of the app root, which is inert while a dialog is open (e.g. the "Deleted …" message) */}
      <Portal>
        <div role="status" class="pointer-events-none fixed right-6 bottom-6 z-50">
          <Show when={getToast()}>
            {(getCurrentToast) => (
              <div
                data-testid="toast"
                class="rounded-control border-line-overlay bg-surface-hover text-fg border px-4 py-3 text-sm shadow-(--toast-shadow)"
              >
                {getCurrentToast().message}
              </div>
            )}
          </Show>
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

export const useToast = (): ShowToast => {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return showToast;
};
