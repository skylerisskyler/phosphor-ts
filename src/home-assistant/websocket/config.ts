// (c) Home Assistant
// homeassistant-js-websocket - Apache v2 license
// adapted to nodejs and project specifics

// import { getCollection } from "./collection";
import { HassConfig, UnsubscribeFunc } from "./types";
import { Connection } from "./connection";
import { Store } from "./store";
import { getConfig } from "./commands";

type ComponentLoadedEvent = {
  data: {
    component: string;
  };
};

function processComponentLoaded(
  state: HassConfig,
  event: ComponentLoadedEvent
): Partial<HassConfig> | null {
  if (state === undefined) return null;

  return {
    components: state.components.concat(event.data.component),
  };
}

const fetchConfig = (conn: Connection) => getConfig(conn);
const subscribeUpdates = (conn: Connection, store: Store<HassConfig>) =>
  Promise.all([
    conn.subscribeEvents(
      store.action(processComponentLoaded),
      "component_loaded"
    ),
    conn.subscribeEvents(
      () => fetchConfig(conn).then((config) => store.setState(config, true)),
      "core_config_updated"
    ),
  ]).then((unsubs) => () => unsubs.forEach((unsub) => unsub()));

export const configColl = (conn: Connection) =>
  getCollection(conn, "_cnf", fetchConfig, subscribeUpdates);

export const subscribeConfig = (
  conn: Connection,
  onChange: (state: HassConfig) => void
): UnsubscribeFunc => configColl(conn).subscribe(onChange);

export const STATE_NOT_RUNNING = "NOT_RUNNING";
export const STATE_STARTING = "STARTING";
export const STATE_RUNNING = "RUNNING";
export const STATE_STOPPING = "STOPPING";
export const STATE_FINAL_WRITE = "FINAL_WRITE";
