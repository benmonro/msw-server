import { setupServer as mswSetupServer } from "msw/node";
import { getEndpointsFor } from "./getEndpoints";

export function setupServer(data: object) {
  const server = mswSetupServer(...getEndpointsFor(data));

  return {
    listen: server.listen,
    resetHandlers() {
      server.resetHandlers(...getEndpointsFor(data));
    },
    close: server.close,
  };
}
