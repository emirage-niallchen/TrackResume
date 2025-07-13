

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        projects: { include: { project: true } },
        techs: { include: { tech: true } },
        files: { include: { file: true } },
      },
    })
    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json({ error: "获取标签失败" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const tag = await prisma.tag.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(tag)
  } catch (error) {
    return NextResponse.json({ error: "更新标签失败" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // 删除标签及其所有关联关系
    await prisma.tag.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: "标签删除成功" })
  } catch (error) {
    console.error("删除标签失败:", error)
    return NextResponse.json(
      { error: "删除标签失败" },
      { status: 500 }
    )
  }
} 