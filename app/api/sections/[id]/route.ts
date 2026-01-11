

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const language = getContentLanguageFromRequest(request);
    const existing = await prisma.resumeSection.findFirst({
      where: { id: params.id, language },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
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