import type { Component } from 'solid-js';
import { createEffect, on, Show } from 'solid-js';
import type { RouteSectionProps } from '@solidjs/router';
import { A, useLocation } from '@solidjs/router';
import { useOidc } from './hook/use-oidc';
import { usePetCountQuery } from './hook/use-pet-count-query';
import { PageError } from './component/partial/page-error';
import { PageErrorProvider } from './hook/use-page-error';
import { HttpError } from './client/error';
import { H1 } from './component/heading';
import { Button } from './component/button';
import { Card, CardBody } from './component/card';
import { LogOutIcon, PawIcon } from './component/icon';
import { ThemeSwitch } from './component/partial/theme-switch';
import { mainId } from './component/partial/delete-dialog';

const navSectionClasses = 'px-2.5 pb-1.5 text-xs font-semibold tracking-[.06em] text-fg-muted uppercase';

const navLinkClasses = 'flex items-center justify-between rounded-lg px-2.5 py-[9px] no-underline';

const navLinkActiveClasses =
  'bg-nav-active text-link-hover hover:text-link-hover font-semibold forced-colors:outline forced-colors:outline-1';

const navLinkInactiveClasses = 'text-fg-secondary hover:bg-surface-hover hover:text-fg';

const App: Component<RouteSectionProps> = (props: RouteSectionProps) => {
  const oidc = useOidc();
  const location = useLocation();
  // oxlint-disable-next-line functional/no-let
  let mainRef: HTMLElement | undefined;

  const petCountQuery = usePetCountQuery(() => oidc.isAuthenticated);

  // after navigating to another page move the focus to the content, so screen readers continue there
  // (only the path: paging, sorting and filtering change the query and keep the focus where it is)
  createEffect(
    on(
      () => location.pathname,
      (pathname, previousPathname) => {
        if (previousPathname === undefined || previousPathname === pathname) {
          return;
        }

        mainRef?.focus();
      },
    ),
  );

  return (
    <PageErrorProvider>
      <div class="flex min-h-full flex-wrap items-stretch">
        <a
          href={`#${mainId}`}
          class="bg-primary text-on-primary rounded-control sr-only font-semibold no-underline focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5"
          onClick={(e) => {
            e.preventDefault();
            mainRef?.focus();
          }}
        >
          Skip to content
        </a>
        <header class="border-line bg-sidebar basis-sidebar flex max-w-full grow flex-col gap-7 border-r px-3.5 py-5">
          <A href="/" class="text-fg hover:text-fg flex items-center gap-2.5 px-2 no-underline">
            <span class="bg-primary text-on-primary flex size-8 items-center justify-center rounded-lg">
              <PawIcon size={18} />
            </span>
            <span class="flex flex-col">
              <strong class="text-[17px]">Petstore</strong>
              <span class="text-fg-muted text-[13px]">Admin</span>
            </span>
          </A>
          <nav aria-label="Main" class="flex flex-col gap-0.5">
            <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
              <li>
                <A
                  data-testid="navigation-home"
                  href="/"
                  end
                  class={navLinkClasses}
                  activeClass={navLinkActiveClasses}
                  inactiveClass={navLinkInactiveClasses}
                >
                  Home
                </A>
              </li>
            </ul>
            <h2 class={`m-0 ${navSectionClasses} pt-[18px]`}>Resources</h2>
            <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
              <li>
                <A
                  data-testid="navigation-pet"
                  href="/pet"
                  aria-label={petCountQuery.data ? `Pets (${petCountQuery.data.count} total)` : undefined}
                  class={navLinkClasses}
                  activeClass={navLinkActiveClasses}
                  inactiveClass={navLinkInactiveClasses}
                >
                  <span>Pets</span>
                  <Show when={petCountQuery.data}>
                    {(getPetCount) => (
                      <span data-testid="navigation-pet-count" class="text-[13px] font-medium">
                        {getPetCount().count}
                      </span>
                    )}
                  </Show>
                </A>
              </li>
            </ul>
          </nav>
          <div class="mt-auto flex flex-col gap-3">
            <Show when={oidc.isAuthenticated}>
              <div class="flex items-center gap-2">
                <strong data-testid="navigation-username" class="min-w-0 flex-1 truncate px-1 text-sm">
                  <span class="sr-only">Signed in as </span>
                  {oidc.username ?? 'unknown'}
                </strong>
                <Button data-testid="navigation-logout" variant="secondary" size="sm" onClick={() => oidc.logout()}>
                  <LogOutIcon />
                  Log out
                </Button>
              </div>
            </Show>
            <ThemeSwitch />
          </div>
        </header>
        {/* focus target of the skip link and after navigating, not interactive itself: no focus ring */}
        <main
          id={mainId}
          ref={(el) => (mainRef = el)}
          tabIndex={-1}
          class="min-w-0 flex-[999_1_560px] px-8 pt-7 pb-12 outline-none"
        >
          {/* caps the line length on wide screens, centered in the space next to the sidebar */}
          <div data-testid="content" class="max-w-content mx-auto flex w-full flex-col gap-[22px]">
            {/* one error at a time: authentication failed, otherwise the one of the page */}
            <PageError
              httpError={
                oidc.error ? new HttpError({ title: 'Authentication failed', detail: oidc.error.message }) : undefined
              }
            />
            <Show when={!oidc.isLoading}>
              <Show
                when={oidc.isAuthenticated}
                fallback={
                  <Card data-testid="login-required" aria-labelledby="login-title" class="max-w-md">
                    <CardBody>
                      <H1 id="login-title">Sign in</H1>
                      <p class="text-fg-muted m-0">You need to sign in to manage the petstore.</p>
                      <div>
                        <Button data-testid="login" variant="primary" onClick={() => oidc.login()}>
                          Sign in
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                }
              >
                {props.children}
              </Show>
            </Show>
          </div>
        </main>
      </div>
    </PageErrorProvider>
  );
};

export default App;
