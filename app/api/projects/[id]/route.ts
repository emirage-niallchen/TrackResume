

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 获取单个项目
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: true,
        links: true,
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

/**
 * 更新项目
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // 删除现有的关联数据
    await prisma.projectImage.deleteMany({
      where: { projectId: params.id },
    });
    await prisma.projectLink.deleteMany({
      where: { projectId: params.id },
    });

    // 更新项目及其关联数据
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        order: data.order,
        isPublished: data.isPublished,
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
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

/**
 * 删除项目
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 