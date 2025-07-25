

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sections = await prisma.resumeSection.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    return NextResponse.json(sections);
  } catch (error) {
    console.error('获取简历部分配置失败:', error);
    return NextResponse.json({ error: '获取简历部分配置失败' }, { status: 500 });
  }
} 