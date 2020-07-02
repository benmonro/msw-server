import { getEndpointsFor } from "./index";
import { setupWorker as mswSetupWorker } from "msw";

export function setupWorker(data: object) {
  const worker = mswSetupWorker(...getEndpointsFor(data));
  return {
    start: worker.start,
    resetHandlers(data: object) {},
  };
}
