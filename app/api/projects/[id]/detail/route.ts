

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
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

    // 获取详情文件内容
    const detailPath = join(process.cwd(), "public", "project", "details", `${projectId}_detail.md`);
    let content = '';
    
    if (existsSync(detailPath)) {
      content = await readFile(detailPath, "utf-8");
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