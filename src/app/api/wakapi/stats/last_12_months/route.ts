// src/app/api/wakapi/stats/last_12_months/route.ts
import { NextResponse } from "next/server"
import { getLast12MonthsStats } from "@/utils/wakapi"

export async function GET() {
  const res = await getLast12MonthsStats()

  if (!res.ok) {
    throw new Error("failed to fetch wakatime data")
  }

  const data = await res.json()

  return NextResponse.json({ data })
}
