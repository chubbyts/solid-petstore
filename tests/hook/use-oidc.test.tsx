/** @jsxImportSource solid-js */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { renderHook, waitFor } from '@solidjs/testing-library';
import type { ParentProps } from 'solid-js';
import { InMemoryWebStorage, User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import type { OidcProviderProps } from '../../src/hook/use-oidc';
import { OidcProvider, useOidc } from '../../src/hook/use-oidc';

const userManager = new UserManager({
  authority: 'https://keycloak.test/realms/petstore',
  client_id: 'petstore-frontend',
  redirect_uri: 'http://localhost:3000/',
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
  automaticSilentRenew: false,
});

const createUser = (expiresAt: number): User => {
  return new User({
    access_token: 'access-token',
    token_type: 'Bearer',
    expires_at: expiresAt,
    profile: { sub: 'sub', iss: 'iss', aud: 'aud', exp: 1, iat: 1 },
  });
};

const createValidUser = (): User => createUser(Math.floor(Date.now() / 1000) + 3600);
const createExpiredUser = (): User => createUser(Math.floor(Date.now() / 1000) - 3600);

const renderUseOidc = (props: Partial<OidcProviderProps> = {}) => {
  return renderHook(useOidc, {
    wrapper: (wrapperProps: ParentProps) => (
      <OidcProvider userManager={userManager} {...props}>
        {wrapperProps.children}
      </OidcProvider>
    ),
  });
};

describe('use-oidc', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
    await userManager.removeUser();
  });

  test('without provider', () => {
    expect(() => renderHook(useOidc)).toThrow('useOidc must be used within an OidcProvider');
  });

  test('unauthenticated', async () => {
    const signinRedirect = vi.spyOn(userManager, 'signinRedirect').mockResolvedValue();

    const { result } = renderUseOidc();

    expect(result.isLoading).toBe(true);

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(false);
    expect(result.error).toBeUndefined();

    window.history.replaceState({}, '', '/pet?page=2');

    await result.login();

    expect(result.isLoading).toBe(false);
    expect(result.error).toBeUndefined();

    expect(signinRedirect).toHaveBeenCalledTimes(1);
    expect(signinRedirect).toHaveBeenNthCalledWith(1, { redirect_uri: 'http://localhost:3000/pet' });
  });

  test('login error', async () => {
    const signinRedirect = vi.spyOn(userManager, 'signinRedirect').mockRejectedValue(new Error('signin failed'));

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    await result.login();

    expect(result.isLoading).toBe(false);
    expect(result.isAuthenticated).toBe(false);
    expect(result.error?.message).toBe('signin failed');

    expect(signinRedirect).toHaveBeenCalledTimes(1);
  });

  test('authenticated', async () => {
    await userManager.storeUser(createValidUser());

    const signoutRedirect = vi.spyOn(userManager, 'signoutRedirect').mockResolvedValue();

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(true);
    expect(result.error).toBeUndefined();

    await result.logout();

    expect(result.isLoading).toBe(false);

    expect(signoutRedirect).toHaveBeenCalledTimes(1);
    expect(signoutRedirect).toHaveBeenNthCalledWith(1);
  });

  test('expired', async () => {
    await userManager.storeUser(createExpiredUser());

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(false);
    expect(result.error).toBeUndefined();
  });

  test('signin callback', async () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    const user = createValidUser();

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockResolvedValue(user);
    const onSigninCallback = vi.fn();

    const { result } = renderUseOidc({ onSigninCallback });

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(true);
    expect(result.error).toBeUndefined();

    expect(signinCallback).toHaveBeenCalledTimes(1);
    expect(onSigninCallback).toHaveBeenCalledTimes(1);
    expect(onSigninCallback).toHaveBeenNthCalledWith(1, user);
  });

  test('signin callback without user and without onSigninCallback', async () => {
    window.history.replaceState({}, '', '/pet?error=access_denied&state=state');

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockResolvedValue(undefined);

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(false);
    expect(result.error).toBeUndefined();

    expect(signinCallback).toHaveBeenCalledTimes(1);
  });

  test('signin callback error', async () => {
    window.history.replaceState({}, '', '/pet?code=code&state=state');

    const signinCallback = vi.spyOn(userManager, 'signinCallback').mockRejectedValue(new Error('invalid_grant'));

    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(false);
    expect(result.error?.message).toBe('invalid_grant');

    expect(signinCallback).toHaveBeenCalledTimes(1);
  });

  test('events', async () => {
    const { result } = renderUseOidc();

    await waitFor(() => expect(result.isLoading).toBe(false));

    expect(result.isAuthenticated).toBe(false);

    // event UserLoaded
    await userManager.events.load(createValidUser());

    expect(result.isAuthenticated).toBe(true);

    // event UserUnloaded
    await userManager.events.unload();

    expect(result.isAuthenticated).toBe(false);

    await userManager.events.load(createValidUser());

    expect(result.isAuthenticated).toBe(true);

    // event UserSignedOut
    // oxlint-disable-next-line eslint/no-underscore-dangle
    await userManager.events._raiseUserSignedOut();

    expect(result.isAuthenticated).toBe(false);

    // event SilentRenewError
    // oxlint-disable-next-line eslint/no-underscore-dangle
    await userManager.events._raiseSilentRenewError(new Error('silent renew failed'));

    expect(result.isLoading).toBe(false);
    expect(result.error?.message).toBe('silent renew failed');
  });
});
