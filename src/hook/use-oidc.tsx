import type { ParentComponent } from 'solid-js';
import { createContext, onCleanup, onMount, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { User, UserManager } from 'oidc-client-ts';
import { throwableToError } from '@chubbyts/chubbyts-throwable-to-error/dist/throwable-to-error';

export type OidcProviderProps = {
  userManager: UserManager;
  onSigninCallback?: (user: User | undefined) => Promise<void> | void;
};

export type Oidc = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: Error;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

type OidcState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | undefined;
};

const OidcContext = createContext<Oidc>();

// check if returning back from authority server (response_mode: query)
const hasAuthParams = (): boolean => {
  const searchParams = new URLSearchParams(window.location.search);

  return Boolean((searchParams.get('code') || searchParams.get('error')) && searchParams.get('state'));
};

export const OidcProvider: ParentComponent<OidcProviderProps> = (props) => {
  const [state, setState] = createStore<OidcState>({ isLoading: true, isAuthenticated: false, error: undefined });

  const signinCallback = async (): Promise<User | undefined> => {
    const user = await props.userManager.signinCallback();

    if (props.onSigninCallback) {
      await props.onSigninCallback(user);
    }

    return user;
  };

  const initialize = async (): Promise<void> => {
    try {
      const signedInUser = hasAuthParams() ? await signinCallback() : undefined;
      const user = signedInUser ?? (await props.userManager.getUser());

      setState({ isLoading: false, isAuthenticated: user ? !user.expired : false, error: undefined });
    } catch (error) {
      setState({ isLoading: false, error: throwableToError(error) });
    }
  };

  const navigate = async (callback: () => Promise<void>): Promise<void> => {
    setState({ isLoading: true });

    try {
      await callback();
    } catch (error) {
      setState({ error: throwableToError(error) });
    } finally {
      setState({ isLoading: false });
    }
  };

  // event UserLoaded (e.g. initial load, silent renew success)
  const handleUserLoaded = (user: User): void => {
    setState({ isLoading: false, isAuthenticated: !user.expired, error: undefined });
  };

  // event UserUnloaded (e.g. userManager.removeUser) / UserSignedOut (e.g. user was signed out in background)
  const handleUserUnloaded = (): void => {
    setState({ isAuthenticated: false });
  };

  // event SilentRenewError (silent renew error)
  const handleSilentRenewError = (error: Error): void => {
    setState({ isLoading: false, error });
  };

  onMount(() => {
    props.userManager.events.addUserLoaded(handleUserLoaded);
    props.userManager.events.addUserUnloaded(handleUserUnloaded);
    props.userManager.events.addUserSignedOut(handleUserUnloaded);
    props.userManager.events.addSilentRenewError(handleSilentRenewError);

    void initialize();
  });

  onCleanup(() => {
    props.userManager.events.removeUserLoaded(handleUserLoaded);
    props.userManager.events.removeUserUnloaded(handleUserUnloaded);
    props.userManager.events.removeUserSignedOut(handleUserUnloaded);
    props.userManager.events.removeSilentRenewError(handleSilentRenewError);
  });

  const oidc: Oidc = {
    get isLoading() {
      return state.isLoading;
    },
    get isAuthenticated() {
      return state.isAuthenticated;
    },
    get error() {
      return state.error;
    },
    // return to the current page after the login
    login: () =>
      navigate(() =>
        props.userManager.signinRedirect({ redirect_uri: `${window.location.origin}${window.location.pathname}` }),
      ),
    logout: () => navigate(() => props.userManager.signoutRedirect()),
  };

  return <OidcContext.Provider value={oidc}>{props.children}</OidcContext.Provider>;
};

export const useOidc = (): Oidc => {
  const oidc = useContext(OidcContext);

  if (!oidc) {
    throw new Error('useOidc must be used within an OidcProvider');
  }

  return oidc;
};
