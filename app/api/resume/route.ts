import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Resume, Tag } from '@prisma/client'

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export type ResumeVO = Resume & {
  tags: { tag: Tag }[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');

    // 查询条件
    const where: any = {
      isPublished: true,
    };

    if (tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: { in: tags },
            isPublished: true,
          },
        },
      };
    }

    const resumeData: ResumeVO[] = await prisma.resume.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(resumeData);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}