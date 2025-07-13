

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 获取单个简历
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resume = await prisma.resume.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!resume) {
      return new NextResponse("简历不存在", { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    return new NextResponse("内部服务器错误", { status: 500 })
  }
}

// 更新简历
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const resume = await prisma.resume.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        organization: body.organization,
        title: body.title,
        location: body.location,
        description: body.description,
        startTime: body.startTime,
        endTime: body.endTime,
        isPublished: body.isPublished,
        order: body.order,
      },
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error("更新简历失败:", error)
    return new NextResponse("更新简历失败", { status: 500 })
  }
}

// 删除简历
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.resume.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("删除简历失败:", error)
    return new NextResponse("删除简历失败", { status: 500 })
  }
}  