

import { NextResponse } from "next/server"
import { TagSchema } from "@/lib/validations/tag"
import { prisma } from "@/lib/prisma"
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage"

export async function GET(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request)
    const tags = await prisma.tag.findMany({
      where: { language },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const language = getContentLanguageFromRequest(req)
    const json = await req.json()
    const body = TagSchema.parse(json)

    const tag = await prisma.tag.create({
      data: {
        language,
        name: body.name,
        description: body.description,
        color: body.color,
        order: body.order || 0,
        isPublished: body.isPublished || false,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: "标签创建失败" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const language = getContentLanguageFromRequest(req)
    const json = await req.json()
    const body = TagSchema.parse(json)

    const existing = await prisma.tag.findFirst({
      where: { id: body.id, language },
    })
    if (!existing) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 })
    }

    const tag = await prisma.tag.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
        order: body.order || 0,
        isPublished: body.isPublished || false,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json(
      { error: "标签更新失败" },
      { status: 500 }
    )
  }
} 