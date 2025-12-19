/* eslint-disable node/prefer-global/process */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { fetchStats } from "@/utils/github"

export async function GET(_req: NextRequest) {
  const token = process.env.GITHUB_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: "server missing GitHub token" }, { status: 503 })
  }

  try {
    const stats = await fetchStats()
    return NextResponse.json(
      stats ?? null,
      { status: 200, headers: { "cache-control": "public, s-maxage=14400" } },
    )
  }
  catch (err: any) {
    return NextResponse.json({ error: "fetch_failed", message: err?.message ?? String(err) }, { status: 500 })
  }
}
