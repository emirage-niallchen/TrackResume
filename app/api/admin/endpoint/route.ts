import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage"

export async function GET(request: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(request)
    const admin = await prisma.admin.findFirst({ where: { language } })
    return NextResponse.json({ endpoint: admin?.endpoint || null })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch endpoint" }, { status: 500 })
  }
} 