

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage"

export async function GET(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request)
    const resumes = await prisma.resume.findMany({
      where: {
        isPublished: true,
        language,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })
    
    return NextResponse.json(resumes)
  } catch (error) {
    console.error('获取履历数据失败:', error)
    return NextResponse.json(
      { error: "获取履历失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request)
    const json = await request.json()
    const resume = await prisma.resume.create({
      data: {
        ...json,
        language: json?.language ?? language,
      },
    })
    
    return NextResponse.json(resume)
  } catch (error) {
    return NextResponse.json(
      { error: "创建履历失败" },
      { status: 500 }
    )
  }
} 