// (c) Home Assistant
// homeassistant-js-websocket - Apache v2 license
// adapted to nodejs and project specifics

import { getCollection } from "./collection";
import { HassServices, HassDomainServices, UnsubscribeFunc } from "./types";
import { Connection } from "./connection";
import { Store } from "./store";
import { getServices } from "./commands";
import { debounce } from "./util";

type ServiceRegisteredEvent = {
  data: {
    domain: string;
    service: string;
  };
};

type ServiceRemovedEvent = {
  data: {
    domain: string;
    service: string;
  };
};

function processServiceRegistered(
  conn: Connection,
  store: Store<HassServices>,
  event: ServiceRegisteredEvent
) {
  const state = store.state;
  if (state === undefined) return;

  const { domain, service } = event.data;

  if (!state.domain?.service) {
    const domainInfo = {
      ...state[domain],
      [service]: { description: "", fields: {} },
    };
    store.setState({ [domain]: domainInfo });
  }
  debouncedFetchServices(conn, store);
}

function processServiceRemoved(
  state: HassServices,
  event: ServiceRemovedEvent
) {
  if (state === undefined) return null;

  const { domain, service } = event.data;
  const curDomainInfo = state[domain];

  if (!curDomainInfo || !(service in curDomainInfo)) return null;

  const domainInfo: HassDomainServices = {};
  Object.keys(curDomainInfo).forEach((sKey) => {
    if (sKey !== service) domainInfo[sKey] = curDomainInfo[sKey];
  });

  return { [domain]: domainInfo };
}

const debouncedFetchServices = debounce(
  (conn: Connection, store: Store<HassServices>) =>
    fetchServices(conn).then((services) => store.setState(services, true)),
  5000
);

const fetchServices = (conn: Connection) => getServices(conn);
const subscribeUpdates = (conn: Connection, store: Store<HassServices>) =>
  Promise.all([
    conn.subscribeEvents<ServiceRegisteredEvent>(
      (ev) =>
        processServiceRegistered(conn, store, ev as ServiceRegisteredEvent),
      "service_registered"
    ),
    conn.subscribeEvents<ServiceRemovedEvent>(
      store.action(processServiceRemoved),
      "service_removed"
    ),
  ]).then((unsubs) => () => unsubs.forEach((fn) => fn()));

export const servicesColl = (conn: Connection) =>
  getCollection(conn, "_srv", fetchServices, subscribeUpdates);

export const subscribeServices = (
  conn: Connection,
  onChange: (state: HassServices) => void
): UnsubscribeFunc => servicesColl(conn).subscribe(onChange);
