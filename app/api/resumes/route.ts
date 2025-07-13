

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      where: {
        isPublished: true,
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
    const json = await request.json()
    const resume = await prisma.resume.create({
      data: json,
    })
    
    return NextResponse.json(resume)
  } catch (error) {
    return NextResponse.json(
      { error: "创建履历失败" },
      { status: 500 }
    )
  }
} 