/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import { Router } from '@solidjs/router';
import Routes from './routes';
import App from './app';

render(
  () => (
    <Router root={App}>
      <Routes />
    </Router>
  ),
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('root')!,
);
