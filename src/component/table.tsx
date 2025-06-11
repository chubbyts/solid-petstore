import type { Component, JSX } from 'solid-js';

export const Table: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={`block w-full md:table ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Thead: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={`block w-full md:table-header-group ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Tbody: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={`block w-full md:table-row-group ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Tr: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={`mb-5 block even:bg-gray-100 md:mt-0 md:table-row ${props.class ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Th: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      class={`block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r ${
        props.class ?? ''
      }`}
    >
      {props.children}
    </div>
  );
};

export const Td: Component<JSX.HTMLAttributes<HTMLDivElement>> = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      class={`block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-t-0 md:first:border-l md:last:border-r ${
        props.class ?? ''
      }`}
    >
      {props.children}
    </div>
  );
};
