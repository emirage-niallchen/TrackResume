

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // 获取未读消息数量
    const unreadMessages = await prisma.inbox.count({
      where: {
        isRead: false
      }
    })

    // 获取项目数量
    const projectCount = await prisma.project.count()

    // 获取技术栈数量
    const techCount = await prisma.tech.count()

    // 获取文件数量
    const fileCount = await prisma.file.count()

    return NextResponse.json({
      unreadMessages,
      projectCount,
      techCount,
      fileCount
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "获取仪表盘数据失败" },
      { status: 500 }
    )
  }
} 