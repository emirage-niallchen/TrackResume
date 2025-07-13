

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const section = await prisma.resumeSection.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(section);
  } catch (error) {
    console.error('更新简历部分失败:', error);
    return NextResponse.json(
      { error: '更新简历部分失败' },
      { status: 500 }
    );
  }
} 