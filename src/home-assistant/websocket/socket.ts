// (c) Home Assistant
// homeassistant-js-websocket - Apache v2 license
// adapted to nodejs and project specifics

/**
 * Create a web socket connection with a Home Assistant instance.
 */
import {
  ERR_INVALID_AUTH,
  ERR_CANNOT_CONNECT,
  ERR_HASS_HOST_REQUIRED,
} from "./errors";
import { Error } from "./types";
import type { ConnectionOptions } from "./connection";
import * as messages from "./messages";
import WebSocket from "ws";

const DEBUG = true;

export const MSG_TYPE_AUTH_REQUIRED = "auth_required";
export const MSG_TYPE_AUTH_INVALID = "auth_invalid";
export const MSG_TYPE_AUTH_OK = "auth_ok";

export interface HaWebSocket extends WebSocket {
  haVersion: string;
}

export function createSocket(options: ConnectionOptions): Promise<HaWebSocket> {
  if (!options.auth) {
    throw ERR_HASS_HOST_REQUIRED;
  }

  const auth = options.auth;

  // Convert from http:// -> ws://, https:// -> wss://
  const url = auth.wsUrl;

  if (DEBUG) {
    console.log("[Auth phase] Initializing", url);
  }

  function connect(
    triesLeft: number,
    promResolve: (socket: HaWebSocket) => void,
    promReject: (err: Error) => void
  ) {
    if (DEBUG) {
      console.log("[Auth Phase] New connection", url);
    }

    const socket = new WebSocket(url) as HaWebSocket;

    // If invalid auth, we will not try to reconnect.
    let invalidAuth = false;

    const closeMessage = () => {
      // If we are in error handler make sure close handler doesn't also fire.
      socket.off("close", closeMessage);
      if (invalidAuth) {
        promReject(ERR_INVALID_AUTH);
        return;
      }

      // Reject if we no longer have to retry
      if (triesLeft === 0) {
        // We never were connected and will not retry
        promReject(ERR_CANNOT_CONNECT);
        return;
      }

      const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
      // Try again in a second
      setTimeout(() => connect(newTries, promResolve, promReject), 1000);
    };

    // Auth is mandatory, so we can send the auth message right away.
    const handleOpen = async (event: MessageEventInit) => {
      try {
        socket.send(JSON.stringify(messages.auth(auth.accessToken)));
      } catch (err) {
        // Refresh token failed
        invalidAuth = err === ERR_INVALID_AUTH;
        socket.close();
      }
    };

    const handleMessage = async (event: any) => {
      const message = JSON.parse(event);

      if (DEBUG) {
        console.log("[Auth phase] Received", message);
      }
      switch (message.type) {
        case MSG_TYPE_AUTH_INVALID:
          invalidAuth = true;
          socket.close();
          break;

        case MSG_TYPE_AUTH_OK:
          socket.off("open", handleOpen);
          socket.off("message", handleMessage);
          socket.off("close", closeMessage);
          socket.off("error", closeMessage);
          socket.haVersion = message.ha_version;
          promResolve(socket);
          break;

        default:
          if (DEBUG) {
            // We already send response to this message when socket opens
            if (message.type !== MSG_TYPE_AUTH_REQUIRED) {
              console.warn("[Auth phase] Unhandled message", message);
            }
          }
      }
    };

    socket.on("open", handleOpen);
    socket.on("message", handleMessage);
    socket.on("close", closeMessage);
    socket.on("error", closeMessage);
  }

  return new Promise((resolve, reject) =>
    connect(options.setupRetry, resolve, reject)
  );
}
