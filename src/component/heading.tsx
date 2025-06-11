import type { Component, JSX } from 'solid-js';

export const H1: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (
  props: JSX.HTMLAttributes<HTMLHeadingElement>,
) => {
  return (
    <h1 {...props} class={`mb-4 border-b border-gray-200 pb-2 text-4xl font-black ${props.class ?? ''}`}>
      {props.children}
    </h1>
  );
};
