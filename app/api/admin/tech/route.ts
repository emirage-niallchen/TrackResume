import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, bgColor, tags, icon } = body;

    // 获取当前最大的 order 值
    const maxOrderTech = await prisma.tech.findFirst({
      orderBy: {
        order: 'desc'
      }
    });

    // 计算新的 order 值
    const newOrder = maxOrderTech ? maxOrderTech.order + 1 : 0;

    // 创建技术栈记录
    const tech = await prisma.tech.create({
      data: {
        name,
        description,
        bgColor,
        icon,
        order: newOrder,
        isPublished: false,
        // 如果提供了标签，创建关联
        ...(tags && tags.length > 0 ? {
          tags: {
            create: tags.map((tagId: string) => ({
              tag: {
                connect: { id: tagId }
              }
            }))
          }
        } : {})
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(tech);
  } catch (error: any) {
    // 处理唯一约束违反的情况
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "技术栈名称已存在" },
        { status: 400 }
      );
    }

    console.error('创建技术栈失败:', error);
    return NextResponse.json(
      { error: "创建失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchName = searchParams.get('name') || '';

    const techs = await prisma.tech.findMany({
      where: {
        name: {
          contains: searchName,
        }
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
    
    return NextResponse.json(techs);
  } catch (error) {
    console.error('查询技术栈失败:', error);
    return NextResponse.json(
      { error: "查询失败" },
      { status: 500 }
    );
  }
}
