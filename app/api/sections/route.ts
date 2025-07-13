

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sections = await prisma.resumeSection.findMany({
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