import type { Component } from 'solid-js';
import { createUniqueId, onCleanup, onMount } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Button } from '../button';

// the element the app is rendered into (see index.html), made inert while the dialog is open
export const appRootId = 'root';

// the content, focused if the element that opened the dialog is gone (e.g. the deleted row)
export const mainId = 'main';

export type DeleteDialogProps = {
  name: string;
  getIsPending: () => boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteDialog: Component<DeleteDialogProps> = (props: DeleteDialogProps) => {
  const titleId = createUniqueId();
  const descriptionId = createUniqueId();
  // oxlint-disable-next-line functional/no-let
  let cancelRef: HTMLButtonElement | undefined;

  // modal: the app behind can't be reached (tab, pointer, screen readers), focus starts on the safe choice
  // and returns to the element that opened the dialog when it closes
  onMount(() => {
    const opener = document.activeElement as HTMLElement | null;
    const appRoot = document.getElementById(appRootId);

    appRoot?.setAttribute('inert', '');
    cancelRef?.focus();

    onCleanup(() => {
      appRoot?.removeAttribute('inert');

      if (opener?.isConnected) {
        opener.focus();
      } else {
        document.getElementById(mainId)?.focus();
      }
    });
  });

  // on the document: also works if the focus left the dialog (e.g. a click on the backdrop)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onCancel();
    }
  };

  document.addEventListener('keydown', onKeyDown);

  onCleanup(() => document.removeEventListener('keydown', onKeyDown));

  return (
    <Portal>
      <div class="bg-overlay fixed inset-0 z-40 flex items-start justify-center px-4 pt-40 pb-4">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          data-testid="delete-dialog"
          class="rounded-dialog border-line-overlay bg-surface flex w-full max-w-[420px] flex-col gap-3 border p-[22px] shadow-(--dialog-shadow)"
        >
          <h2 id={titleId} class="m-0 text-xl font-bold">
            Delete {props.name}?
          </h2>
          <p id={descriptionId} class="text-fg-muted m-0">
            This can’t be undone.
          </p>
          <div class="flex justify-end gap-2 pt-1.5">
            <Button
              ref={(el) => (cancelRef = el)}
              data-testid="delete-dialog-cancel"
              variant="secondary"
              onClick={() => props.onCancel()}
            >
              Cancel
            </Button>
            <Button
              data-testid="delete-dialog-confirm"
              variant="danger"
              disabled={props.getIsPending()}
              onClick={() => props.onConfirm()}
            >
              Delete pet
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
