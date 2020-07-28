import { setupServer as mswSetupServer } from "msw/node";
import { getEndpointsFor } from "./getEndpoints";

export function setupServer(data?: object) {
  const server = mswSetupServer(...getEndpointsFor(data));

  return {
    ...server, 
    resetHandlers() {
      server.resetHandlers(...getEndpointsFor(data));
    },
  };
}
