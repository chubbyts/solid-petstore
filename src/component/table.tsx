import type { Component, JSX } from 'solid-js';
import { children, createContext, Show, splitProps, useContext } from 'solid-js';
import { cx } from './class-names';

export type SortDirection = 'asc' | 'desc';

type Align = 'left' | 'right';

const alignClasses: Record<Align, string> = { left: 'text-left', right: 'text-right' };

const sortArrows = { asc: '↑', desc: '↓', none: '↕' };

const ariaSorts = { asc: 'ascending', desc: 'descending' } as const;

// stacked: the rows are shown as cards (one below the other) if the table is narrower than 48rem (container query)
const StackedContext = createContext<boolean>(false);

// the rows of the head are not shown as cards
const HeadContext = createContext<boolean>(false);

export type TableProps = JSX.HTMLAttributes<HTMLTableElement> & {
  // rows as cards on narrow screens instead of scrolling horizontally, use the `label` of the cells
  stackOnNarrow?: boolean;
};

// scrolls horizontally instead of squeezing the columns on small screens (unless stacked)
export const Table: Component<TableProps> = (props: TableProps) => {
  const [local, rest] = splitProps(props, ['stackOnNarrow', 'class']);

  return (
    <StackedContext.Provider value={local.stackOnNarrow ?? false}>
      <div class={cx('overflow-x-auto', local.stackOnNarrow && '@container')}>
        <table
          {...rest}
          class={cx(
            'w-full border-collapse text-left',
            local.class,
            local.stackOnNarrow && '@max-3xl:block @max-3xl:min-w-0',
          )}
        />
      </div>
    </StackedContext.Provider>
  );
};

type SectionProps = JSX.HTMLAttributes<HTMLTableSectionElement>;

export const Thead: Component<SectionProps> = (props: SectionProps) => {
  const [local, rest] = splitProps(props, ['class']);
  const stacked = useContext(StackedContext);

  return (
    <HeadContext.Provider value={true}>
      <thead {...rest} class={cx('bg-surface-muted', stacked && '@max-3xl:block', local.class)} />
    </HeadContext.Provider>
  );
};

export const Tbody: Component<SectionProps> = (props: SectionProps) => {
  const [local, rest] = splitProps(props, ['class']);
  const stacked = useContext(StackedContext);

  return <tbody {...rest} class={cx(stacked && '@max-3xl:block', local.class)} />;
};

export type TrProps = JSX.HTMLAttributes<HTMLTableRowElement>;

// "group" lets the cells highlight the whole row on hover
export const Tr: Component<TrProps> = (props: TrProps) => {
  const [local, rest] = splitProps(props, ['class']);
  const stacked = useContext(StackedContext);
  const head = useContext(HeadContext);

  return (
    <tr
      {...rest}
      class={cx(
        'group',
        stacked &&
          (head
            ? '@max-3xl:flex'
            : 'border-line @max-3xl:hover:bg-row-hover @max-3xl:flex @max-3xl:flex-col @max-3xl:gap-2 @max-3xl:border-b @max-3xl:px-4 @max-3xl:py-3.5'),
        local.class,
      )}
    />
  );
};

export type ThProps = JSX.ThHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
  // column only as wide as its content, the remaining width goes to the other columns
  shrink?: boolean;
  // makes the header a sort toggle, `sort` is the current direction of this column (undefined: not sorted)
  // stacked: the only headers shown (the cells have their own labels)
  onSort?: () => void;
  sort?: SortDirection;
};

export const Th: Component<ThProps> = (props: ThProps) => {
  const [local, rest] = splitProps(props, ['align', 'shrink', 'onSort', 'sort', 'class', 'children']);
  const stacked = useContext(StackedContext);

  return (
    <th
      scope="col"
      aria-sort={local.onSort && local.sort ? ariaSorts[local.sort] : undefined}
      {...rest}
      class={cx(
        'border-line text-fg-muted border-b px-4 py-2.5 text-[13px] font-semibold',
        alignClasses[local.align ?? 'left'],
        local.shrink && 'w-px whitespace-nowrap',
        stacked && (local.onSort ? '@max-3xl:block @max-3xl:grow' : '@max-3xl:hidden'),
        local.class,
      )}
    >
      <Show when={local.onSort} fallback={local.children}>
        {(getOnSort) => (
          <button type="button" class="text-fg-secondary hover:text-fg p-0 font-semibold" onClick={() => getOnSort()()}>
            {local.children} <span aria-hidden="true">{sortArrows[local.sort ?? 'none']}</span>
          </button>
        )}
      </Show>
    </th>
  );
};

export type TdProps = JSX.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: Align;
  // less padding, for cells holding buttons
  compact?: boolean;
  nowrap?: boolean;
  // stacked: shown in front of the value (the column headers are hidden), empty cells are hidden
  label?: string;
};

const isEmpty = (resolved: unknown): boolean =>
  resolved === undefined ||
  resolved === null ||
  resolved === false ||
  (Array.isArray(resolved) && resolved.every(isEmpty));

export const Td: Component<TdProps> = (props: TdProps) => {
  const [local, rest] = splitProps(props, ['align', 'compact', 'nowrap', 'label', 'class', 'children']);
  const stacked = useContext(StackedContext);

  // resolved once: used to find out if the cell is empty and to render it
  const resolved = children(() => local.children);
  const empty = () => isEmpty(resolved());

  return (
    <td
      {...rest}
      class={cx(
        'border-line group-hover:bg-row-hover border-b',
        local.compact ? 'px-3 py-2' : 'px-4 py-3',
        alignClasses[local.align ?? 'left'],
        local.nowrap && 'whitespace-nowrap',
        stacked &&
          (empty()
            ? '@max-3xl:hidden'
            : '@max-3xl:flex @max-3xl:flex-wrap @max-3xl:items-center @max-3xl:gap-x-3 @max-3xl:gap-y-1 @max-3xl:border-0 @max-3xl:p-0 @max-3xl:text-left @max-3xl:wrap-break-word @max-3xl:whitespace-normal @max-3xl:group-hover:bg-transparent'),
        local.class,
      )}
    >
      <Show when={stacked && local.label && !empty()}>
        <span class="text-fg-muted hidden w-28 shrink-0 text-sm font-medium @max-3xl:inline">{local.label}</span>
      </Show>
      {resolved()}
    </td>
  );
};
