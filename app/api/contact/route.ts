

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const contactSchema = z.object({
  //可选
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^1[3-9]\d{9}$/).optional(),
  description: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, description } = contactSchema.parse(body);


    // 保存手机号记录
    await prisma.inbox.create({
      data: {
        type: 'etc',
        value: description,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
} 