

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst();
    // console.log("admin", admin);
    if (!admin) {
      return NextResponse.json({ error: '无法找到个人资料' }, { status: 404 });
    }

    //获取关联数据
    const customFields = await prisma.customField.findMany({
      orderBy: { order: 'asc' },
    });
    console.log("customFields", customFields);
    return NextResponse.json({
      admin,
      customFields,
    });
  } catch (error) {
    console.error('获取个人资料失败:', error);
    return NextResponse.json({ error: '获取个人资料失败' }, { status: 500 });
  }
} 



