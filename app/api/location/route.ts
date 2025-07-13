

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const locationSchema = z.object({
  id: z.string().optional(),
  latitude: z.number()
    .min(-90).max(90)
    .refine((val) => !isNaN(val), { message: "纬度必须是有效数字" }),
  longitude: z.number()
    .min(-180).max(180)
    .refine((val) => !isNaN(val), { message: "经度必须是有效数字" }),
  address: z.string().min(1, "地址不能为空"),
  description: z.string(),
  zoom: z.number().optional().default(13)
});

export async function GET() {
  try {
    const location = await prisma.location.findFirst();
    
    if (!location) {
      return NextResponse.json({ error: '无法找到位置信息' }, { status: 404 });
    }
    
    return NextResponse.json(location);
  } catch (error) {
    console.error('获取位置信息失败:', error);
    return NextResponse.json({ error: '获取位置信息失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = locationSchema.parse(await request.json());
    
    const location = await prisma.location.upsert({
      where: { id: data.id || '' },
      update: data,
      create: data,
    });
    return NextResponse.json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
} 