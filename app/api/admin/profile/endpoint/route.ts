import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {

    //只保留  字段 endpoint
    const admin = await prisma.admin.findFirst({
      select: { endpoint: true },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error("获取个人资料失败:", error);
    return NextResponse.json(
      { error: "获取个人资料失败" },
      { status: 500 }
    );
  }
} 