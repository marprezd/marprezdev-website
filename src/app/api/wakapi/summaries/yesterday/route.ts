// src/app/api/wakapi/summaries/yesterday/route.ts
import { NextResponse } from "next/server"
import { getSummariesYesterday } from "@/utils/wakapi"

export async function GET() {
  const res = await getSummariesYesterday()

  if (!res.ok) {
    throw new Error("failed to fetch wakatime data")
  }

  const data = await res.json()

  return NextResponse.json({ data })
}
