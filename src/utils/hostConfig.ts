// src/utils/hostConfig.ts
import process from "node:process"

// Default port
export const port = process.env.PORT || 3000
/*
 * Default host
 * If APP_BASE_URL is set, it will be used as the host.
 * Otherwise, it will be `http://localhost:${port}`
 */
export const host = process.env.APP_BASE_URL
  ? process.env.APP_BASE_URL
  : `http://localhost:${port}`
