

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function GET(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request);
    const sections = await prisma.resumeSection.findMany({
      where: { language },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('获取简历部分失败:', error);
    return NextResponse.json(
      { error: '获取简历部分失败' },
      { status: 500 }
    );
  }
} 