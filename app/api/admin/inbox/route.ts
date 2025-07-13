import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAuth } from "@/lib/auth"

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export async function DELETE() {
    try {
        const authResult = await checkAuth();
        if (!authResult.authorized) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        await prisma.inbox.deleteMany()
        return NextResponse.json({ message: "所有消息已删除" })
    } catch (error) {
        console.error("[INBOX_DELETE]", error)
        return new NextResponse("内部错误", { status: 500 })
    }
}

export async function GET(request: Request) {
  try {
    const authResult = await checkAuth();
    if (!authResult.authorized) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "20")
    const isRead = searchParams.get("isRead")
    const skip = (page - 1) * pageSize

    // 方式1：不写select，返回所有字段
    const [messages, total] = await Promise.all([
      prisma.inbox.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: isRead ? { isRead: true } : undefined,
        // 不写select，默认返回所有字段
        skip,
        take: pageSize
      }),
      prisma.inbox.count()
    ])

    // 方式2：如果要明确指定所有字段，可以这样写：
    /*
    const messages = await prisma.inbox.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true,
        updatedAt: true
        // ... 其他字段
      },
      skip,
      take: pageSize
    })
    */

    return NextResponse.json({
      data: messages,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error("[INBOX_GET]", error)
    return new NextResponse("内部错误", { status: 500 })
  }
} 