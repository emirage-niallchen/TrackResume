

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function GET(request: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(request);
    const admin =
      (await prisma.admin.findFirst({ where: { language } })) ??
      (language !== 'zh' ? await prisma.admin.findFirst({ where: { language: 'zh' } }) : null);
    if (!admin) return NextResponse.json({ error: '无法找到个人资料' }, { status: 404 });

    //获取关联数据
    const customFields = await prisma.customField.findMany({
      where: { language: admin.language },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({
      contentLanguage: admin.language,
      admin,
      customFields,
    });
  } catch (error) {
    console.error('Profile API: fetch failed', error);
    return NextResponse.json({ error: '获取个人资料失败' }, { status: 500 });
  }
} 



