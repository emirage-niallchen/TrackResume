import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function GET(request: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(request);

    //只保留  字段 endpoint
    const admin = await prisma.admin.findFirst({
      where: { language },
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