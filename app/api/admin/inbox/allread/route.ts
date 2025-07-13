

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT() {
    try {
        console.log("所有消息已读开始执行")
        await prisma.inbox.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        })
        return new NextResponse("所有消息已读", { status: 200 })
    } catch (error) {
        console.error("[INBOX_ALLREAD]", error)
        return new NextResponse("内部错误", { status: 500 })
    }
} 