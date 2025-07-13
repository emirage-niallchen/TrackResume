

// 删除单个消息
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        await prisma.inbox.delete({
            where: { id }
        })
        return NextResponse.json({ message: "消息已删除" })
    } catch (error) {
        console.error("[INBOX_DELETE]", error)
        return new NextResponse("内部错误", { status: 500 })
    }
}
