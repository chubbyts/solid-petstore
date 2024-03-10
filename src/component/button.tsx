import type { Component, JSX } from 'solid-js';
import type { AnchorProps } from '@solidjs/router';
import { A } from '@solidjs/router';

type ColorTheme = 'blue' | 'gray' | 'green' | 'red';

const getColorThemeClasses = (colorTheme: ColorTheme) => {
  switch (colorTheme) {
    case 'blue':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'gray':
      return 'bg-gray-600 hover:bg-gray-700';
    case 'green':
      return 'bg-green-600 hover:bg-green-700';
    case 'red':
      return 'bg-red-600 hover:bg-red-700';
  }
};

export const AnchorButton: Component<AnchorProps & { colorTheme: ColorTheme }> = (
  props: AnchorProps & { colorTheme: ColorTheme },
) => {
  return (
    <A
      {...props}
      class={`inline-block px-5 py-2 text-white ${getColorThemeClasses(props.colorTheme)} ${props.class ?? ''}`}
    >
      {props.children}
    </A>
  );
};

export const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement> & { colorTheme: ColorTheme }> = (
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & { colorTheme: ColorTheme },
) => {
  return (
    <button
      {...props}
      class={`inline-block px-5 py-2 text-white ${getColorThemeClasses(props.colorTheme)} ${props.class ?? ''}`}
    >
      {props.children}
    </button>
  );
};
