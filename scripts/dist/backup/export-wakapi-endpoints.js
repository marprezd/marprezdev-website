"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_buffer_1 = require("node:buffer");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const WAKAPI_API_KEY = node_process_1.default.env.WAKAPI_API_KEY || "";
const WAKAPI_BASE = node_process_1.default.env.WAKAPI_BASE_URL || "http://localhost:3000";
const NEXT_BASE = node_process_1.default.env.NEXT_BASE_URL || "http://localhost:3001";
// If we have a Wakapi API key, talk directly to the Wakapi compat endpoints.
// Otherwise prefer the local Next.js proxy endpoints (no extra auth needed when running `pnpm dev`).
const useWakapi = Boolean(WAKAPI_API_KEY);
const BASE = useWakapi ? WAKAPI_BASE : NEXT_BASE;
const endpoints = useWakapi
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
    ];
const BACKUP_DIR = node_path_1.default.resolve(node_process_1.default.cwd(), "wakapi", "backups");
if (!node_fs_1.default.existsSync(BACKUP_DIR))
    node_fs_1.default.mkdirSync(BACKUP_DIR, { recursive: true });
// Small helper: fetch with timeout and retries + exponential backoff
async function fetchWithRetries(url, init, attempts = 3, timeoutMs = 10000) {
    const f = globalThis.fetch;
    if (!f)
        throw new Error("fetch not available in this Node runtime");
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        const attempt = i + 1;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            console.log(`Attempt ${attempt}/${attempts} GET ${url} (timeout ${timeoutMs}ms)`);
            const res = await f(url, { ...init, signal: controller.signal });
            clearTimeout(id);
            return res;
        }
        catch (err) {
            lastErr = err;
            clearTimeout(id);
            const backoff = Math.round(1000 * 2 ** i + Math.random() * 250);
            console.warn(`Request failed (attempt ${attempt}): ${err instanceof Error ? err.message : String(err)} — retrying in ${backoff}ms`);
            await new Promise(r => setTimeout(r, backoff));
        }
    }
    throw lastErr;
}
async function fetchAndSave(ep) {
    const url = `${BASE}${ep.path}`;
    const maxAttempts = Number(node_process_1.default.env.WAKAPI_FETCH_RETRIES || 3);
    const timeoutMs = Number(node_process_1.default.env.WAKAPI_FETCH_TIMEOUT_MS || 10000);
    try {
        const headers = {
            Accept: "application/json",
        };
        if (WAKAPI_API_KEY)
            headers.Authorization = `Basic ${node_buffer_1.Buffer.from(WAKAPI_API_KEY).toString("base64")}`;
        console.log(`Fetching ${url} -> saving to ${BACKUP_DIR}`);
        const res = await fetchWithRetries(url, { method: "GET", headers }, maxAttempts, timeoutMs);
        if (!res.ok) {
            console.warn(`Endpoint ${ep.name} returned status ${res.status} ${res.statusText}`);
            return;
        }
        // attempt to parse JSON, fallback to text when needed
        let data;
        try {
            data = await res.json();
        }
        catch (err) {
            console.warn(`Failed to parse JSON for ${ep.name}, saving raw text instead: ${err instanceof Error ? err.message : String(err)}`);
            data = await res.text();
        }
        const fileName = `wakapi-${ep.name}-${new Date().toISOString().split("T")[0]}.json`;
        const filePath = node_path_1.default.join(BACKUP_DIR, fileName);
        node_fs_1.default.writeFileSync(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
        // write a small metadata file with status/time/size
        const meta = {
            url,
            status: res.status,
            fetchedAt: new Date().toISOString(),
            size: node_fs_1.default.statSync(filePath).size,
        };
        node_fs_1.default.writeFileSync(node_path_1.default.join(BACKUP_DIR, `${fileName}.meta.json`), JSON.stringify(meta, null, 2));
        console.log(`Saved ${filePath} (${meta.size} bytes)`);
    }
    catch (err) {
        console.error(`Failed to fetch ${ep.name}:`, err instanceof Error ? err.message : String(err));
    }
}
async function run() {
    for (const ep of endpoints) {
        await fetchAndSave(ep);
    }
}
run().catch((err) => {
    console.error(err);
    node_process_1.default.exit(1);
});
