// (c) Home Assistant
// homeassistant-js-websocket - Apache v2 license
// adapted to nodejs and project specifics

import { Store, createStore } from "./store";
import { Connection } from "./connection";
import { UnsubscribeFunc } from "./types";

export type Collection<State> = {
  state: State;
  refresh(): Promise<void>;
  subscribe(subscriber: (state: State) => void): UnsubscribeFunc;
};

export const getCollection = <State>(
  connection: any,
  key: string,
  fetchCollection: (connection: Connection) => Promise<State>,
  subscribeUpdates?: (
    connection: Connection,
    store: Store<State>
  ) => Promise<UnsubscribeFunc>
): Collection<State> => {
  if (connection[key]) {
    return connection[key];
  }

  let active = 0;
  let unsubProm: Promise<UnsubscribeFunc>;
  let store = createStore<State>();

  const refresh = () =>
    fetchCollection(connection).then((state) => store.setState(state, true));

  const refreshSwallow = () =>
    refresh().catch((err: unknown) => {
      // Swallow errors if socket is connecting, closing or closed.
      // We will automatically call refresh again when we re-establish the connection.
      if (connection.connected) {
        throw err;
      }
    });

  connection[key] = {
    get state() {
      return store.state;
    },

    refresh,

    subscribe(subscriber: (state: State) => void): UnsubscribeFunc {
      active++;

      // If this was the first subscriber, attach collection
      if (active === 1) {
        if (subscribeUpdates) {
          unsubProm = subscribeUpdates(connection, store);
        }

        // Fetch when connection re-established.
        connection.addEventListener("ready", refreshSwallow);

        refreshSwallow();
      }

      const unsub = store.subscribe(subscriber);

      if (store.state !== undefined) {
        // Don't call it right away so that caller has time
        // to initialize all the things.
        setTimeout(() => subscriber(store.state!), 0);
      }

      return () => {
        unsub();
        active--;
        if (!active) {
          // Unsubscribe from changes
          if (unsubProm)
            unsubProm.then((unsub) => {
              unsub();
            });
          connection.removeEventListener("ready", refresh);
        }
      };
    },
  };

  return connection[key];
};

// Legacy name. It gets a collection and subscribes.
export const createCollection = <State>(
  key: string,
  fetchCollection: (conn: Connection) => Promise<State>,
  subscribeUpdates:
    | ((conn: Connection, store: Store<State>) => Promise<UnsubscribeFunc>)
    | undefined,
  conn: Connection,
  onChange: (state: State) => void
): UnsubscribeFunc =>
  getCollection(conn, key, fetchCollection, subscribeUpdates).subscribe(
    onChange
  );
