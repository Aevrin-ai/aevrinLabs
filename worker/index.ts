import { withRanges } from "./range";

/*
  The Worker behind aevrinlabs.com. It only runs for /video/* (see
  run_worker_first in wrangler.jsonc); every other path is served straight
  from the static assets. For the film it adds byte ranges, which the static
  assets do not answer on their own.
*/

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const file = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
    return withRanges(request, file);
  },
};
