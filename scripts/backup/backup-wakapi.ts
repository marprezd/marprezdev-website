// scripts/backup/backup-wakapi.ts
import child_process from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import sqlite3 from "sqlite3"

// Tipos
interface TableRow {
  [key: string]: any
}

interface TableData {
  [key: string]: TableRow[]
}

// Configuration
// Resolve the database path by trying several common locations
// and allowing override with the WAKAPI_DB_PATH environment variable.
const defaultPaths = [
  path.resolve(process.cwd(), "wakapi", "data", "wakapi.db"),
  path.resolve(process.cwd(), "public", "wakapi", "data", "wakapi.db"),
]

const DB_PATH = process.env.WAKAPI_DB_PATH || defaultPaths.find(p => fs.existsSync(p)) || defaultPaths[0]

// Choose a backup directory based on where the DB is located
const BACKUP_DIR = process.env.WAKAPI_BACKUP_DIR
  || (DB_PATH.includes(path.join("public", "wakapi"))
    ? path.resolve(process.cwd(), "public", "wakapi", "backups")
    : path.resolve(process.cwd(), "wakapi", "backups"))
const BACKUP_FILE = path.join(BACKUP_DIR, `wakapi-backup-${new Date().toISOString().split("T")[0]}.json`)

// Ensure the backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

// Function to query the database
function queryDatabase(): Promise<TableData> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err: Error | null) => {
      if (err) {
        console.error("Error opening database:", err.message)
        return reject(err)
      }

      // Query to get all tables
      db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (err: Error | null, tables: { name: string }[]) => {
          if (err) {
            db.close()
            return reject(err)
          }

          const backup: TableData = {}

          // Function to get data from a table
          const getTableData = (tableName: string): Promise<TableRow[]> => {
            return new Promise((resolveTable, rejectTable) => {
              db.all(`SELECT * FROM ${tableName}`, [], (err: Error | null, rows: TableRow[]) => {
                if (err)
                  return rejectTable(err)
                resolveTable(rows)
              })
            })
          }

          // Iterate over all tables and get their data
          const tablePromises = tables
            .filter(table => !table.name.startsWith("sqlite_")) // Ignore system tables
            .map((table) => {
              return getTableData(table.name)
                .then((data) => {
                  backup[table.name] = data
                })
                .catch((error) => {
                  console.warn(`Warning: Could not backup table ${table.name}:`, error.message)
                  // Continue with other tables even if one fails
                })
            })

          Promise.all(tablePromises)
            .then(() => {
              db.close()
              resolve(backup)
            })
            .catch((err) => {
              db.close()
              reject(err)
            })
        },
      )
    })
  })
}

// Run the backup
async function runBackup() {
  try {
    console.log("Starting Wakapi database backup...")
    console.log(`Using DB_PATH=${DB_PATH} exists=${fs.existsSync(DB_PATH)}`)

    // If the database doesn't exist on the host, try fallback to the
    // export-wakapi-endpoints.js script (does not require direct access to sqlite3)
    if (!fs.existsSync(DB_PATH)) {
      console.warn("The database doesn't exist on the host. Trying fallback: export-wakapi-endpoints.js via HTTP...")
      try {
        const res = child_process.spawnSync(process.execPath, [path.join("scripts", "dist", "backup", "export-wakapi-endpoints.js")], { stdio: "inherit" })
        process.exit(res.status === null ? 1 : res.status)
      }
      catch (err) {
        console.error("Failed to run export-wakapi-endpoints.js:", err instanceof Error ? err.message : String(err))
        process.exit(1)
      }
    }

    // Get database data
    const backupData = await queryDatabase()

    // Write backup file
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2))
    console.log(`Backup completed: ${BACKUP_FILE}`)

    // Keep only the last 7 days of backups
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith("wakapi-backup-") && file.endsWith(".json"))
      .sort()
      .reverse()

    if (files.length > 7) {
      const filesToDelete = files.slice(7)
      filesToDelete.forEach((file) => {
        fs.unlinkSync(path.join(BACKUP_DIR, file))
        console.log(`Deleted old backup: ${file}`)
      })
    }

    process.exit(0)
  }
  catch (error) {
    console.error("Error during backup:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

runBackup()
