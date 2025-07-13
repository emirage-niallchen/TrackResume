

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAuth();
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { techId, direction } = await request.json();

    // 获取当前技术栈
    const currentTech = await prisma.tech.findUnique({
      where: { id: techId }
    });

    if (!currentTech) {
      return NextResponse.json({ error: "技术栈不存在" }, { status: 404 });
    }

    // 根据移动方向查找相邻的技术栈
    const adjacentTech = await prisma.tech.findFirst({
      where: {
        order: direction === 'up' 
          ? { lt: currentTech.order }
          : { gt: currentTech.order }
      },
      orderBy: {
        order: direction === 'up' ? 'desc' : 'asc'
      }
    });

    if (!adjacentTech) {
      return NextResponse.json({ error: "已经到达边界" }, { status: 400 });
    }

    // 交换两个技术栈的顺序
    await prisma.$transaction([
      prisma.tech.update({
        where: { id: currentTech.id },
        data: { order: adjacentTech.order }
      }),
      prisma.tech.update({
        where: { id: adjacentTech.id },
        data: { order: currentTech.order }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("重新排序失败:", error);
    return NextResponse.json({ error: "重新排序失败" }, { status: 500 });
  }
} 