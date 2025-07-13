

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  label: z.string(),
  value: z.string(),
  type: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
  isPublished: z.boolean().default(false)
});

export async function POST(request: Request) {
  try {
    const data = createSchema.parse(await request.json());
    const customField = await prisma.customField.create({ data });
    return NextResponse.json(customField);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create custom field' },
      { status: 500 }
    );
  }
} 