import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst()
    return NextResponse.json({ endpoint: admin?.endpoint || null })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch endpoint" }, { status: 500 })
  }
} 