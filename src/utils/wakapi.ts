// src/utils/wakapi.ts
import { Buffer } from "node:buffer"
import process from "node:process"

// Environment variables
const wakapi_api_key: string = process.env.WAKAPI_API_KEY || ""
const wakapi_user: string = process.env.WAKAPI_USER || ""

// Endpoints
const WAKAPI_ENDPOINT_LAST_12_MONTHS = `https://wakapi.marprezd.dev/api/compat/wakatime/v1/users/${wakapi_user}/stats/last_12_months`
const WAKAPI_ENDPOINT_SUMMARIES_LAST_7_DAYS = `https://wakapi.marprezd.dev/api/compat/wakatime/v1/users/${wakapi_user}/summaries?range=last_7_days`
const WAKAPI_ENDPOINT_SUMMARIES_YESTERDAY = `https://wakapi.marprezd.dev/api/compat/wakatime/v1/users/${wakapi_user}/summaries?range=yesterday`
const WAKAPI_ENDPOINT_SUMMARIES_TODAY = `https://wakapi.marprezd.dev/api/compat/wakatime/v1/users/${wakapi_user}/summaries?range=today`

/*
 * Fetches the last 12 months stats from Wakapi
 * Revalidates every 4 hours
 *
 * @returns {Promise<Response>}
 */
export async function getLast12MonthsStats() {
  return fetch(WAKAPI_ENDPOINT_LAST_12_MONTHS, {
    next: {
      revalidate: 60 * 60 * 4,
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(wakapi_api_key).toString("base64")}`,
    },
  })
}

/*
 * Fetches the last 7 days stats from Wakapi
 * Revalidates every 4 hours
 *
 * @returns {Promise<Response>}
 */
export async function getSummariesLast7DaysStats() {
  return fetch(WAKAPI_ENDPOINT_SUMMARIES_LAST_7_DAYS, {
    next: {
      revalidate: 60 * 60 * 4,
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(wakapi_api_key).toString("base64")}`,
    },
  })
}

/*
 * Fetches the yesterday stats from Wakapi
 * Revalidates every 24 hours
 *
 * @returns {Promise<Response>}
 */
export async function getSummariesYesterday() {
  return fetch(WAKAPI_ENDPOINT_SUMMARIES_YESTERDAY, {
    next: {
      revalidate: 60 * 60 * 24,
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(wakapi_api_key).toString("base64")}`,
    },
  })
}

/*
 * Fetches the today stats from Wakapi
 * Revalidates every 4 hours
 *
 * @returns {Promise<Response>}
 */
export async function getSummariesToday() {
  return fetch(WAKAPI_ENDPOINT_SUMMARIES_TODAY, {
    next: {
      revalidate: 60 * 60 * 4,
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(wakapi_api_key).toString("base64")}`,
    },
  })
}
