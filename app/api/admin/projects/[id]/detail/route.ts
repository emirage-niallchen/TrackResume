
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // 从数据库中的 S3 路径读取
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        detail: true,
      },
    });

    if (!project?.detail) {
      return NextResponse.json({ error: "详情文件不存在" }, { status: 404 });
    }

    try {
      const res = await fetch(project.detail);
      if (!res.ok) {
        console.error("从 S3 获取详情文件失败:", res.status, res.statusText);
        return NextResponse.json(
          { error: "详情文件获取失败" },
          { status: 500 }
        );
      }
      const content = await res.text();
      return NextResponse.json({ content });
    } catch (error) {
      console.error("从 S3 读取项目详情文件失败:", error);
      return NextResponse.json(
        { error: "读取项目详情文件失败" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("读取项目详情文件失败:", error);
    return NextResponse.json(
      { error: "读取项目详情文件失败" },
      { status: 500 }
    );
  }
}
