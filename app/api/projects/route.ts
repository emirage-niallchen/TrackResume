import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Project, Tag, ProjectImage, ProjectLink} from "@prisma/client";

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export type ProjectVO = Project & {
  tags: { tag: Tag }[];
  images: ProjectImage[];
  links: ProjectLink[];
};

/**
 * 获取所有项目
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const tags = searchParams.getAll('tags'); // 获取所有tags参数
    
    const projects = await prisma.project.findMany({
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
        images: true,
        links: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    }) as ProjectVO[]; // 类型断言，确保为ProjectVO数组

    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('获取项目数据失败:', error);
    return NextResponse.json({ error: '获取项目数据失败' }, { status: 500 });
  }
}

/**
 * 创建新项目
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        order: data.order || 0,
        isPublished: data.isPublished || false,
        images: {
          create: data.images || [],
        },
        links: {
          create: data.links || [],
        },
      },
      include: {
        images: true,
        links: true,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
} 