
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // 获取项目信息
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        images: true,
        links: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    // 从 S3 路径读取详情内容（project.detail）
    let content = "";
    if (project.detail) {
      try {
        const res = await fetch(project.detail);
        if (res.ok) {
          content = await res.text();
        } else {
          console.error("从 S3 获取详情文件失败:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("从 S3 读取项目详情失败:", error);
      }
    }

    return NextResponse.json({
      project,
      content
    });
  } catch (error) {
    console.error("读取项目详情失败:", error);
    return NextResponse.json(
      { error: "读取项目详情失败" },
      { status: 500 }
    );
  }
}