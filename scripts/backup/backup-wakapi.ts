// scripts/backup/backup-wakapi.ts
import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import process from "node:process"

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env.local")
    const envFile = readFileSync(envPath, "utf-8")

    envFile.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const [, key, value] = match
        if (!process.env[key]) {
          process.env[key] = value.trim()
        }
      }
    })
  }
  catch (error) {
    const errorMessage = (error as Error).message
    console.warn(`⚠️  No .env file found or error reading it: ${errorMessage}. Using system environment variables`)
  }
}

// Load environment variables
loadEnv()

// Constants
const BACKUP_DIR = join(process.cwd(), "wakapi", "backups")
const EXPORT_SCRIPT = join(process.cwd(), "scripts", "dist", "backup", "export-wakapi-endpoints.js")

function ensureBackupDir() {
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true })
    console.log(`Created backup directory: ${BACKUP_DIR}`)
  }
}

function runBackup() {
  console.log("🚀 Starting Wakapi backup process...")

  try {
    // Ensure backup directory exists
    ensureBackupDir()

    // Verify required environment variables
    if (!process.env.WAKAPI_API_KEY || !process.env.WAKAPI_USER) {
      throw new Error("Missing required environment variables: WAKAPI_API_KEY and WAKAPI_USER must be set")
    }

    console.log("📤 Exporting Wakapi endpoints...")

    // Run the export script with proper error handling
    execSync(`node ${EXPORT_SCRIPT}`, {
      stdio: "inherit",
      env: {
        ...process.env,
        BACKUP_DIR, // Pass the backup directory to the export script
      },
    })

    console.log("✅ Wakapi backup completed successfully")
  }
  catch (error) {
    const errorMessage = (error as Error).message
    console.error("❌ Error during Wakapi backup:", errorMessage)
    process.exit(1)
  }
}

// Run the backup
if (require.main === module) {
  runBackup()
}

export { runBackup }
