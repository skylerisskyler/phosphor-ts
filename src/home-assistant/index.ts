// JS extensions in imports allow tsc output to be consumed by browsers.
import { createSocket } from "./socket";
import { Connection, ConnectionOptions } from "./connection";

export * from "./auth";
// export * from "./collection";
export * from "./connection";
// export * from "./config.txs";
// export * from "./services";
export * from "./entities";
export * from "./errors";
export * from "./socket";
export * from "./types";
export * from "./commands";

export async function createConnection(options?: Partial<ConnectionOptions>) {
  const connOptions: ConnectionOptions = {
    setupRetry: 0,
    createSocket,
    ...options,
  };

  const socket = await connOptions.createSocket(connOptions);
  const conn = new Connection(socket, connOptions);
  return conn;
}