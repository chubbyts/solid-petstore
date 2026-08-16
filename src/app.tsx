import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import type { RouteSectionProps } from '@solidjs/router';
import { A } from '@solidjs/router';
import { useOidc } from './hook/use-oidc';
import { HttpError as HttpErrorPartial } from './component/partial/http-error';
import { HttpError } from './client/error';
import { H1 } from './component/heading';
import { Button } from './component/button';

const App: Component<RouteSectionProps> = (props: RouteSectionProps) => {
  const [getDisplayMenu, setDisplayMenu] = createSignal<boolean>(false);
  const oidc = useOidc();

  const toggleMenu = () => {
    setDisplayMenu(!getDisplayMenu());
  };

  return (
    <div class="relative flex min-h-full flex-col md:flex-row">
      <nav class="absolute flow-root h-16 w-full bg-gray-900 px-4 py-3 text-2xl leading-relaxed font-semibold text-gray-100 uppercase">
        <button
          type="button"
          class="float-right ml-4 block border-2 p-2 md:hidden"
          data-testid="navigation-toggle"
          onClick={toggleMenu}
        >
          <span class="block h-2 w-6 border-t-2" />
          <span class="block h-2 w-6 border-t-2" />
          <span class="block h-0 w-6 border-t-2" />
        </button>
        <Show when={oidc.isAuthenticated}>
          <button
            type="button"
            data-testid="navigation-logout"
            class="float-right ml-4 border-2 px-3 py-1 text-base leading-relaxed hover:bg-gray-700"
            onClick={oidc.logout}
          >
            Logout
          </button>
        </Show>
        <A href="/" class="hover:text-gray-500">
          Petstore
        </A>
      </nav>
      <nav
        class={`mt-16 w-full bg-gray-200 md:block md:w-1/3 lg:w-1/4 xl:w-1/5 ${getDisplayMenu() ? 'block' : 'hidden'}`}
      >
        <ul>
          <li>
            <A
              href="/pet"
              class="block px-4 py-2"
              inactiveClass="text-gray-900 bg-gray-300 hover:bg-gray-400"
              activeClass="text-gray-100 bg-gray-700 hover:bg-gray-600"
            >
              Pets
            </A>
          </li>
        </ul>
      </nav>
      <div class={`w-full px-6 py-8 md:w-2/3 lg:w-3/4 xl:w-4/5 ${getDisplayMenu() ? 'mt-0' : 'mt-16'}`}>
        <Show when={oidc.error}>
          {(getError) => (
            <HttpErrorPartial
              httpError={new HttpError({ title: 'Authentication failed', detail: getError().message })}
            />
          )}
        </Show>
        <Show when={!oidc.isLoading}>
          <Show
            when={oidc.isAuthenticated}
            fallback={
              <div data-testid="login-required">
                <H1>Login</H1>
                <p class="mb-4">You need to login to use the petstore.</p>
                <Button data-testid="login" colorTheme="blue" onClick={oidc.login}>
                  Login
                </Button>
              </div>
            }
          >
            {props.children}
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default App;
