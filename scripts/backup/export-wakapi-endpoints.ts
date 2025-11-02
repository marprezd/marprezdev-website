import { Buffer } from "node:buffer"
// scripts/backup/export-wakapi-endpoints.ts
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import process from "node:process"

// Configuration
const WAKAPI_API_KEY = process.env.WAKAPI_API_KEY || ""
const WAKAPI_USER = process.env.WAKAPI_USER || ""
const BACKUP_DIR = process.env.BACKUP_DIR || join(process.cwd(), "wakapi", "backups")

// Optional proxy: if you want the script to call your Next.js API (which proxies to Wakapi)
// set WAKAPI_PROXY_URL to e.g. `https://marprezd.dev` or `http://localhost:3000`.
const WAKAPI_PROXY_URL = (process.env.WAKAPI_PROXY_URL || "").replace(/\/$/, "")
const WAKAPI_BASE_URL = (process.env.WAKAPI_BASE_URL || "https://wakapi.marprezd.dev").replace(/\/$/, "")

// Endpoints configuration — prefer proxy endpoints when WAKAPI_PROXY_URL is set
const ENDPOINTS: Record<string, string> = WAKAPI_PROXY_URL
  ? {
      // proxy routes implemented in the Next.js app
      dataLast12Months: `${WAKAPI_PROXY_URL}/api/wakapi/stats/last_12_months`,
      dataLast7Days: `${WAKAPI_PROXY_URL}/api/wakapi/summaries/last_7_days`,
      dataYesterday: `${WAKAPI_PROXY_URL}/api/wakapi/summaries/yesterday`,
      dataToday: `${WAKAPI_PROXY_URL}/api/wakapi/summaries/today`,
    }
  : {
      dataLast12Months: `${WAKAPI_BASE_URL}/compat/wakatime/v1/users/${WAKAPI_USER.replace(/"/g, "")}/stats/last_12_months`,
      dataLast7Days: `${WAKAPI_BASE_URL}/compat/wakatime/v1/users/${WAKAPI_USER.replace(/"/g, "")}/summaries?range=last_7_days`,
      dataYesterday: `${WAKAPI_BASE_URL}/compat/wakatime/v1/users/${WAKAPI_USER.replace(/"/g, "")}/summaries?range=yesterday`,
      dataToday: `${WAKAPI_BASE_URL}/compat/wakatime/v1/users/${WAKAPI_USER.replace(/"/g, "")}/summaries?range=today`,
    }

// (ENDPOINTS is defined above; no duplicate definitions)

async function fetchEndpoint(url: string) {
  // Build headers conditionally: if we're calling a proxy (the Next.js API),
  // we don't need to send Basic auth because the proxy will use its own server-side key.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (!WAKAPI_PROXY_URL || !url.startsWith(WAKAPI_PROXY_URL)) {
    // Basic auth needs the 'username:password' string base64-encoded.
    // Use API key as username and an empty password (key:)
    headers.Authorization = `Basic ${Buffer.from(`${WAKAPI_API_KEY}:`).toString("base64")}`
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    // Try to include response body to aid debugging (some APIs return JSON/text explaining the error)
    const bodyText = await response.text().catch(() => "")
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}${bodyText ? ` - ${bodyText}` : ""}`)
  }

  return response.json()
}

async function saveBackup(data: any, endpointName: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `wakapi-${endpointName}-${timestamp}.json`
  const filePath = join(BACKUP_DIR, filename)

  await writeFile(filePath, JSON.stringify(data, null, 2))
  console.log(`💾 Backup saved: ${filePath}`)
  return filePath
}

async function backupEndpoints() {
  const results = []
  const timestamp = new Date().toISOString()

  try {
    console.log("🔍 Starting to backup Wakapi endpoints...")

    // Ensure backup directory exists so writeFile won't fail if this script is run standalone
    await mkdir(BACKUP_DIR, { recursive: true })

    for (const [endpointName, url] of Object.entries(ENDPOINTS)) {
      try {
        console.log(`🔄 Backing up ${endpointName}...`)
        const data = await fetchEndpoint(url)
        const filePath = await saveBackup(data, endpointName)
        results.push({ endpoint: endpointName, status: "success", file: filePath })
      }
      catch (error) {
        const errorMessage = (error as Error).message
        console.error(`❌ Error backing up ${endpointName}:`, errorMessage)
        results.push({ endpoint: endpointName, status: "error", error: errorMessage })
      }
    }

    // Save summary of all backups
    const summary = {
      timestamp,
      environment: {
        wakapiUser: WAKAPI_USER,
        backupDir: BACKUP_DIR,
      },
      results,
    }

    await saveBackup(summary, "summary")
    console.log("✅ All endpoints backed up successfully")
    return { success: true, results }
  }
  catch (error) {
    const errorMessage = (error as Error).message
    console.error("❌ Backup process failed:", errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Run the backup if this file is executed directly
if (require.main === module) {
  // Run and exit with appropriate code so `node` or CI can react to failure
  backupEndpoints()
    .then(({ success }) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error("Unhandled error in backup process:", error)
      process.exit(1)
    })
}

export { backupEndpoints }
