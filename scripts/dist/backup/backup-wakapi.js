"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/backup/backup-wakapi.ts
const node_child_process_1 = __importDefault(require("node:child_process"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const sqlite3_1 = __importDefault(require("sqlite3"));
// Configuración
// Resolver la ruta de la base de datos intentando varios lugares comunes
// y permitiendo sobrescribir con la variable de entorno WAKAPI_DB_PATH.
const defaultPaths = [
    node_path_1.default.resolve(node_process_1.default.cwd(), "wakapi", "data", "wakapi.db"),
    node_path_1.default.resolve(node_process_1.default.cwd(), "public", "wakapi", "data", "wakapi.db"),
];
const DB_PATH = node_process_1.default.env.WAKAPI_DB_PATH || defaultPaths.find(p => node_fs_1.default.existsSync(p)) || defaultPaths[0];
// Elegir un directorio de backups en función de dónde se encuentre la DB
const BACKUP_DIR = node_process_1.default.env.WAKAPI_BACKUP_DIR
    || (DB_PATH.includes(node_path_1.default.join("public", "wakapi"))
        ? node_path_1.default.resolve(node_process_1.default.cwd(), "public", "wakapi", "backups")
        : node_path_1.default.resolve(node_process_1.default.cwd(), "wakapi", "backups"));
const BACKUP_FILE = node_path_1.default.join(BACKUP_DIR, `wakapi-backup-${new Date().toISOString().split("T")[0]}.json`);
// Asegúrate de que el directorio de respaldos exista
if (!node_fs_1.default.existsSync(BACKUP_DIR)) {
    node_fs_1.default.mkdirSync(BACKUP_DIR, { recursive: true });
}
// Function to query the database
function queryDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3_1.default.Database(DB_PATH, sqlite3_1.default.OPEN_READONLY, (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
                return reject(err);
            }
            // Query to get all tables
            db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
                if (err) {
                    db.close();
                    return reject(err);
                }
                const backup = {};
                // Function to get data from a table
                const getTableData = (tableName) => {
                    return new Promise((resolveTable, rejectTable) => {
                        db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
                            if (err)
                                return rejectTable(err);
                            resolveTable(rows);
                        });
                    });
                };
                // Iterate over all tables and get their data
                const tablePromises = tables
                    .filter(table => !table.name.startsWith("sqlite_")) // Ignore system tables
                    .map((table) => {
                    return getTableData(table.name)
                        .then((data) => {
                        backup[table.name] = data;
                    })
                        .catch((error) => {
                        console.warn(`Warning: Could not backup table ${table.name}:`, error.message);
                        // Continue with other tables even if one fails
                    });
                });
                Promise.all(tablePromises)
                    .then(() => {
                    db.close();
                    resolve(backup);
                })
                    .catch((err) => {
                    db.close();
                    reject(err);
                });
            });
        });
    });
}
// Run the backup
async function runBackup() {
    try {
        console.log("Starting Wakapi database backup...");
        console.log(`Using DB_PATH=${DB_PATH} exists=${node_fs_1.default.existsSync(DB_PATH)}`);
        // If the database doesn't exist on the host, try fallback to the
        // export-wakapi-endpoints.js script (does not require direct access to sqlite3)
        if (!node_fs_1.default.existsSync(DB_PATH)) {
            console.warn("The database doesn't exist on the host. Trying fallback: export-wakapi-endpoints.js via HTTP...");
            try {
                const res = node_child_process_1.default.spawnSync(node_process_1.default.execPath, [node_path_1.default.join("scripts", "dist", "backup", "export-wakapi-endpoints.js")], { stdio: "inherit" });
                node_process_1.default.exit(res.status === null ? 1 : res.status);
            }
            catch (err) {
                console.error("Failed to run export-wakapi-endpoints.js:", err instanceof Error ? err.message : String(err));
                node_process_1.default.exit(1);
            }
        }
        // Get database data
        const backupData = await queryDatabase();
        // Write backup file
        node_fs_1.default.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));
        console.log(`Backup completed: ${BACKUP_FILE}`);
        // Keep only the last 7 days of backups
        const files = node_fs_1.default
            .readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith("wakapi-backup-") && file.endsWith(".json"))
            .sort()
            .reverse();
        if (files.length > 7) {
            const filesToDelete = files.slice(7);
            filesToDelete.forEach((file) => {
                node_fs_1.default.unlinkSync(node_path_1.default.join(BACKUP_DIR, file));
                console.log(`Old backup removed: ${file}`);
            });
        }
        node_process_1.default.exit(0);
    }
    catch (error) {
        console.error("Error during backup:", error instanceof Error ? error.message : String(error));
        node_process_1.default.exit(1);
    }
}
runBackup();
