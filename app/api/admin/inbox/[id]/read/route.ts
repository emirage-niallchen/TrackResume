

// 更新单个消息为已读
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log("更新消息为已读开始执行")
        const message = await prisma.inbox.update({
            where: {
                id: params.id
            },
            data: {
                isRead: true
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error('标记消息已读失败:', error)
        return NextResponse.json(
            { error: '标记消息已读失败' },
            { status: 500 }
        )
    }
}