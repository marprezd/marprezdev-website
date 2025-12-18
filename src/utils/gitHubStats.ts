// src/utils/gitHubStats.ts
import type { Stats } from "@/types"

// If running on the server (Node), use the shared server helper directly.
// Otherwise (client), call the internal API route.
export async function getGitHubStats(): Promise<Stats | null> {
  if (typeof window === "undefined") {
    // Server-side: import fetchStats from our server helper to avoid an HTTP hop
    try {
      const { fetchStats } = await import("@/lib/github")
      return await fetchStats()
    }
    catch (err) {
      console.warn("getGitHubStats: server fetch failed", err)
      return null
    }
  }

  // Client-side: call the API route
  try {
    const res = await fetch("/api/github/stats")
    if (!res.ok) {
      return null
    }
    const json = await res.json()
    return json as Stats | null
  }
  catch (err) {
    console.warn("getGitHubStats: client fetch failed", err)
    return null
  }
}
