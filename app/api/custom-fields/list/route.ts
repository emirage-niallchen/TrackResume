

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { type, isPublished, page, pageSize } = await request.json();
    const where: any = {};
    if (type) where.type = type;
    if (isPublished !== undefined) where.isPublished = isPublished;

    const [fields, total] = await Promise.all([
      prisma.customField.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: page ? (page - 1) * (pageSize || 10) : undefined,
        take: pageSize || 10,
      }),
      prisma.customField.count({ where })
    ]);

    return NextResponse.json({ data: fields, total, page, pageSize });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch custom fields' },
      { status: 500 }
    );
  }
} 