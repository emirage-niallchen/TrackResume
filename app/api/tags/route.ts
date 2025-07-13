

import { NextResponse } from "next/server"
import { TagSchema } from "@/lib/validations/tag"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = TagSchema.parse(json)

    const tag = await prisma.tag.create({
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
      { error: "标签创建失败" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const json = await req.json()
    const body = TagSchema.parse(json)

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