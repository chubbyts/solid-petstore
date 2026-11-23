import type { Component } from 'solid-js';
import { formatDateTime } from '../format';

// machine readable value for assistive technology and browser tools, formatted in the browser's time zone
export const DateTime: Component<{ value: string }> = (props: { value: string }) => (
  <time datetime={props.value}>{formatDateTime(props.value)}</time>
);
