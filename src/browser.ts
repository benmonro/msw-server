import { setupWorker as mswSetupWorker } from "msw";
import { getEndpointsFor } from "./getEndpoints";

export function setupWorker(data: object) {
  const worker = mswSetupWorker(...getEndpointsFor(data));
  return {
    ...worker,
    resetHandlers(data: object) {},
  };
}
