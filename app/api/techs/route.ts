import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Tech } from '@prisma/client';
import { Tag } from '@prisma/client';

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export type TechVO = Tech & {
  tags: Tag[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tags = searchParams.getAll('tags');
    
    const techs = await prisma.tech.findMany({
      where: {
        isPublished: true,
        ...(tags.length > 0 && {
          tags: {
            some: {
              tag: {
                name: {
                  in: tags
                }
              }
            }
          }
        }),
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    // 转换数据格式以匹配 TechVO 类型
    const formattedTechs = techs.map(tech => ({
      ...tech,
      tags: tech.tags.map(t => t.tag)
    }));
    
    return NextResponse.json(formattedTechs);
  } catch (error) {
    console.error('获取技术栈数据失败:', error);
    return NextResponse.json({ error: '获取技术栈数据失败' }, { status: 500 });
  }
} 