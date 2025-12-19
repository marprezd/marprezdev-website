/* eslint-disable node/prefer-global/process */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchMonthlyStats } from "@/utils/github"

/*
  Server-side proxy for GitHub GraphQL Monthly Stats.
  Keeps the GitHub token on the server and returns the grouped monthly data
  so the client can call this route without needing the token or dealing with CORS.
*/

/* monthly route delegates to shared server helper */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const login = searchParams.get("login") || ""

  if (!login) {
    return NextResponse.json({ error: "missing login parameter" }, { status: 400 })
  }

  const token = process.env.GITHUB_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: "server missing GitHub token" }, { status: 503 })
  }

  try {
    const result = await fetchMonthlyStats(login)
    return NextResponse.json(result, { status: 200, headers: { "cache-control": "public, s-maxage=14400" } })
  }
  catch (err: any) {
    return NextResponse.json({ error: "fetch_failed", message: err?.message ?? String(err) }, { status: 500 })
  }
}
