/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { OidcProvider } from './hook/use-oidc';
import { oidcConfig } from './oidc';
import Routes from './routes';
import App from './app';
import './index.css';

const queryClient = new QueryClient();

render(
  () => (
    <OidcProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <Router root={App}>
          <Routes />
        </Router>
      </QueryClientProvider>
    </OidcProvider>
  ),
  // oxlint-disable-next-line typescript/no-non-null-assertion
  document.getElementById('root')!,
);
