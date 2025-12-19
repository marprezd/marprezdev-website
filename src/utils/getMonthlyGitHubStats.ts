// src/utils/getMonthlyGitHubStats.ts
import type { MonthlyStats } from "@/types"

/**
 * Client helper which calls our internal API route that proxies GitHub GraphQL.
 * This avoids exposing the GitHub token to the browser and avoids CORS issues.
 */
export async function getMonthlyGitHubStats(login: string): Promise<MonthlyStats> {
  try {
    const res = await fetch(`/api/github/monthly?login=${encodeURIComponent(login)}`)

    if (!res.ok) {
      // Return empty result on failure so callers can render gracefully
      console.warn("getMonthlyGitHubStats: server responded with", res.status)
      return { issues: {}, prs: {}, repos: {}, stars: {} }
    }

    const json = await res.json() as any

    // If the server returned an error payload, handle it gracefully
    if (json && typeof json === "object" && "error" in json) {
      console.warn("getMonthlyGitHubStats: API error", json)
      return { issues: {}, prs: {}, repos: {}, stars: {} }
    }

    return json as MonthlyStats
  }
  catch (err: any) {
    console.warn("getMonthlyGitHubStats: fetch failed", err?.message ?? err)
    return { issues: {}, prs: {}, repos: {}, stars: {} }
  }
}
