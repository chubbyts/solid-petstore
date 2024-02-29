import type { Component, JSX } from 'solid-js';

export const H1: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (
  props: JSX.HTMLAttributes<HTMLHeadingElement>,
) => {
  return <h1 class="mb-4 border-b pb-2 text-4xl font-black">{props.children}</h1>;
};
