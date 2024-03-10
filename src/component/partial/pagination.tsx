import type { Accessor, Component } from 'solid-js';
import { For, Show } from 'solid-js';

const calculatePages = (currentPage: number, totalPages: number, maxPages: number) => {
  if (totalPages <= 1 || maxPages <= 1 || currentPage > totalPages) {
    return [];
  }

  const pages = [currentPage];

  for (let i = 1; ; i++) {
    if (currentPage - i >= 1) {
      pages.push(currentPage - i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }

    if (currentPage + i <= totalPages) {
      pages.push(currentPage + i);

      if (pages.length === maxPages || pages.length === totalPages) {
        break;
      }
    }
  }

  pages.sort((a, b) => a - b);

  return pages;
};

export type PaginationProps = {
  submitPage: (page: number) => void;
  getCurrentPage: Accessor<number>;
  getTotalPages: Accessor<number>;
  getMaxPages: Accessor<number>;
};

export const Pagination: Component<PaginationProps> = (props: PaginationProps) => {
  const getPages = () => {
    return calculatePages(props.getCurrentPage(), props.getTotalPages(), props.getMaxPages());
  };

  return (
    <Show when={getPages().length > 0}>
      <ul class="w-fit border-y border-l border-gray-300">
        <Show when={props.getCurrentPage() > 2}>
          <li class="inline-block">
            <button
              class="border-r border-gray-300 px-3 py-2"
              onClick={() => {
                props.submitPage(1);
              }}
            >
              &laquo;
            </button>
          </li>
        </Show>
        <Show when={props.getCurrentPage() > 1}>
          <li class="inline-block">
            <button
              class="border-r border-gray-300 px-3 py-2"
              onClick={() => {
                props.submitPage(props.getCurrentPage() - 1);
              }}
            >
              &lt;
            </button>
          </li>
        </Show>
        <For each={getPages()}>
          {(page) => (
            <li class="inline-block">
              <button
                class={`border-r border-gray-300 px-3 py-2 ${props.getCurrentPage() === page ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  props.submitPage(page);
                }}
              >
                {page}
              </button>
            </li>
          )}
        </For>
        <Show when={props.getCurrentPage() < props.getTotalPages()}>
          <li class="inline-block">
            <button
              class="border-r border-gray-300 px-3 py-2"
              onClick={() => {
                props.submitPage(props.getCurrentPage() + 1);
              }}
            >
              &gt;
            </button>
          </li>
        </Show>
        <Show when={props.getCurrentPage() < props.getTotalPages() - 1}>
          <li class="inline-block">
            <button
              class="border-r border-gray-300 px-3 py-2"
              onClick={() => {
                props.submitPage(props.getTotalPages());
              }}
            >
              &raquo;
            </button>
          </li>
        </Show>
      </ul>
    </Show>
  );
};
