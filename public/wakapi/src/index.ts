/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// The worker acts as a small proxy to your self-hosted Wakapi service.
// Dynamic `import()` of arbitrary files doesn't work with the Workers bundler
// (esbuild) — it must resolve imports statically. Instead we forward HTTP
// requests to the configured `WAKAPI_BASE_URL` and return the response.

export default {
  // `env` contains the bindings injected by Wrangler (WAKAPI_BASE_URL, WAKAPI_API_KEY, ...)
  async fetch(request: Request, env: any): Promise<Response> {
    const incoming = new URL(request.url)

    // Build target URL based on configured base (fall back to localhost for local dev)
    const base = (env && env.WAKAPI_BASE_URL) || "http://localhost:3000"
    const target = new URL(base)

    // Preserve the incoming path and query
    target.pathname = incoming.pathname
    target.search = incoming.search

    // Forward headers, add Authorization header when API key is present
    const headers = new Headers(request.headers)
    if (env && env.WAKAPI_API_KEY) {
      // Workers have global btoa
      headers.set("Authorization", `Basic ${btoa(String(env.WAKAPI_API_KEY))}`)
    }

    // Forward the request to Wakapi
    const resp = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    })

    // Mirror response status, headers and body
    const responseHeaders = new Headers(resp.headers)
    // Optionally adjust CORS or other headers here

    return new Response(resp.body, {
      status: resp.status,
      headers: responseHeaders,
    })
  },
}
