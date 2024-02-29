/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import Routes from './routes';
import { Router } from '@solidjs/router';
import App from './app';

render(
  () => (
    <Router root={App}>
      <Routes />
    </Router>
  ),
  document.getElementById('root')!,
);
