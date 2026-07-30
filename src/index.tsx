/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import Routes from './routes';
import App from './app';
import './index.css';

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router root={App}>
        <Routes />
      </Router>
    </QueryClientProvider>
  ),
  // oxlint-disable-next-line typescript/no-non-null-assertion
  document.getElementById('root')!,
);
