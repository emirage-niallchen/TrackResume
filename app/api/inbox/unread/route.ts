

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await prisma.inbox.count({
      where: {
        isRead: false
      }
    });
    
    return NextResponse.json(count);
  } catch (error) {
    return NextResponse.json({ error: "获取未读消息失败" }, { status: 500 });
  }
} 