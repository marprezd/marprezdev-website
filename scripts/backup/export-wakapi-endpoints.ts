import { Buffer } from "node:buffer"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

interface Endpoint {
  name: string
  path: string
}

const WAKAPI_API_KEY = process.env.WAKAPI_API_KEY || ""
const WAKAPI_BASE = process.env.WAKAPI_BASE_URL || "http://localhost:3000"
const NEXT_BASE = process.env.NEXT_BASE_URL || "http://localhost:3001"

// If we have a Wakapi API key, talk directly to the Wakapi compat endpoints.
// Otherwise prefer the local Next.js proxy endpoints (no extra auth needed when running `pnpm dev`).
const useWakapi = Boolean(WAKAPI_API_KEY)

const BASE = useWakapi ? WAKAPI_BASE : NEXT_BASE

const endpoints: Endpoint[] = useWakapi
  ? [
      { name: "last_12_months", path: "/api/compat/wakatime/v1/users/current/stats/last_12_months" },
      { name: "summaries_last_7_days", path: "/api/compat/wakatime/v1/users/current/summaries?range=last_7_days" },
      { name: "summaries_yesterday", path: "/api/compat/wakatime/v1/users/current/summaries?range=yesterday" },
      { name: "summaries_today", path: "/api/compat/wakatime/v1/users/current/summaries?range=today" },
    ]
  : [
      { name: "last_12_months", path: "/api/wakapi/stats/last_12_months" },
      // Next proxy (`/api/wakapi`) returns summaries?range=last_7_days per src/app/api/wakapi/route.ts
      { name: "summaries_last_7_days", path: "/api/wakapi" },
    ]

const BACKUP_DIR = path.resolve(process.cwd(), "wakapi", "backups")

if (!fs.existsSync(BACKUP_DIR))
  fs.mkdirSync(BACKUP_DIR, { recursive: true })

// Small helper: fetch with timeout and retries + exponential backoff
async function fetchWithRetries(url: string, init: RequestInit, attempts = 3, timeoutMs = 10_000) {
  const f = (globalThis as any).fetch
  if (!f)
    throw new Error("fetch not available in this Node runtime")

  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    const attempt = i + 1
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      console.log(`Attempt ${attempt}/${attempts} GET ${url} (timeout ${timeoutMs}ms)`)
      const res: Response = await f(url, { ...init, signal: controller.signal })
      clearTimeout(id)
      return res
    }
    catch (err) {
      lastErr = err
      clearTimeout(id)
      const backoff = Math.round(1000 * 2 ** i + Math.random() * 250)
      console.warn(`Request failed (attempt ${attempt}): ${err instanceof Error ? err.message : String(err)} — retrying in ${backoff}ms`)
      await new Promise(r => setTimeout(r, backoff))
    }
  }
  throw lastErr
}

async function fetchAndSave(ep: Endpoint) {
  const url = `${BASE}${ep.path}`
  const maxAttempts = Number(process.env.WAKAPI_FETCH_RETRIES || 3)
  const timeoutMs = Number(process.env.WAKAPI_FETCH_TIMEOUT_MS || 10_000)

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    }
    if (WAKAPI_API_KEY)
      headers.Authorization = `Basic ${Buffer.from(WAKAPI_API_KEY).toString("base64")}`

    console.log(`Fetching ${url} -> saving to ${BACKUP_DIR}`)
    const res = await fetchWithRetries(url, { method: "GET", headers }, maxAttempts, timeoutMs)

    if (!res.ok) {
      console.warn(`Endpoint ${ep.name} returned status ${res.status} ${res.statusText}`)
      return
    }

    // attempt to parse JSON, fallback to text when needed
    let data: unknown
    try {
      data = await res.json()
    }
    catch (err) {
      console.warn(`Failed to parse JSON for ${ep.name}, saving raw text instead: ${err instanceof Error ? err.message : String(err)}`)
      data = await res.text()
    }

    const fileName = `wakapi-${ep.name}-${new Date().toISOString().split("T")[0]}.json`
    const filePath = path.join(BACKUP_DIR, fileName)
    fs.writeFileSync(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2))

    // write a small metadata file with status/time/size
    const meta = {
      url,
      status: res.status,
      fetchedAt: new Date().toISOString(),
      size: fs.statSync(filePath).size,
    }
    fs.writeFileSync(path.join(BACKUP_DIR, `${fileName}.meta.json`), JSON.stringify(meta, null, 2))

    console.log(`Saved ${filePath} (${meta.size} bytes)`)
  }
  catch (err) {
    console.error(`Failed to fetch ${ep.name}:`, err instanceof Error ? err.message : String(err))
  }
}

async function run() {
  for (const ep of endpoints) {
    await fetchAndSave(ep)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
