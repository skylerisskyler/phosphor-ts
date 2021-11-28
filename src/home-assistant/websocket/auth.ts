import { parseQuery } from "./util";
import {
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  ERR_INVALID_HTTPS_TO_HTTP,
} from "./errors";

export type AuthData = {
  hassUrl: string;
  clientId: string | null;
  expires: number;
  refresh_token: string;
  access_token: string;
  expires_in: number;
};

export type SaveTokensFunc = (data: AuthData | null) => void;
export type LoadTokensFunc = () => Promise<AuthData | null | undefined>;

export type getAuthOptions = {
  hassUrl?: string;
  clientId?: string | null;
  redirectUrl?: string;
  authCode?: string;
  saveTokens?: SaveTokensFunc;
  loadTokens?: LoadTokensFunc;
};

type QueryCallbackData =
  | {}
  | {
    state: string;
    code: string;
    auth_callback: string;
  };

type OAuthState = {
  hassUrl: string;
  clientId: string | null;
};

type AuthorizationCodeRequest = {
  grant_type: "authorization_code";
  code: string;
};

type RefreshTokenRequest = {
  grant_type: "refresh_token";
  refresh_token: string;
};

export const genClientId = (): string =>
  `${location.protocol}//${location.host}/`;

export const genExpires = (expires_in: number): number => {
  return expires_in * 1000 + Date.now();
};

function genRedirectUrl() {
  // Get current url but without # part.
  const { protocol, host, pathname, search } = location;
  return `${protocol}//${host}${pathname}${search}`;
}

function genAuthorizeUrl(
  hassUrl: string,
  clientId: string | null,
  redirectUrl: string,
  state: string
) {
  let authorizeUrl = `${hassUrl}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
    redirectUrl
  )}`;

  if (clientId !== null) {
    authorizeUrl += `&client_id=${encodeURIComponent(clientId)}`;
  }

  if (state) {
    authorizeUrl += `&state=${encodeURIComponent(state)}`;
  }
  return authorizeUrl;
}

function redirectAuthorize(
  hassUrl: string,
  clientId: string | null,
  redirectUrl: string,
  state: string
) {
  // Add either ?auth_callback=1 or &auth_callback=1
  redirectUrl += (redirectUrl.includes("?") ? "&" : "?") + "auth_callback=1";

  document.location!.href = genAuthorizeUrl(
    hassUrl,
    clientId,
    redirectUrl,
    state
  );
}



function encodeOAuthState(state: OAuthState): string {
  return btoa(JSON.stringify(state));
}

function decodeOAuthState(encoded: string): OAuthState {
  return JSON.parse(atob(encoded));
}

export class Auth {
  private _saveTokens?: SaveTokensFunc;
  data: AuthData;

  constructor(data: AuthData, saveTokens?: SaveTokensFunc) {
    this.data = data;
    this._saveTokens = saveTokens;
  }

  get wsUrl() {
    // Convert from http:// -> ws://, https:// -> wss://
    return `ws${this.data.hassUrl.substr(4)}/api/websocket`;
  }

  get accessToken() {
    return this.data.access_token;
  }

  get expired() {
    return Date.now() > this.data.expires;
  }

}

export function createLongLivedTokenAuth(
  hassUrl: string,
  access_token: string
) {
  return new Auth({
    hassUrl,
    clientId: null,
    expires: Date.now() + 1e11,
    refresh_token: "",
    access_token,
    expires_in: 1e11,
  });
}
