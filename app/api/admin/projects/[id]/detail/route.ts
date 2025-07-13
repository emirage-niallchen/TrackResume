

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const detailPath = join(process.cwd(), "public", "project", "details", `${projectId}_detail.md`);

    // 检查文件是否存在
    if (!existsSync(detailPath)) {
      return NextResponse.json({ error: "详情文件不存在" }, { status: 404 });
    }

    // 读取文件内容
    const content = await readFile(detailPath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    console.error("读取项目详情文件失败:", error);
    return NextResponse.json(
      { error: "读取项目详情文件失败" },
      { status: 500 }
    );
  }
}
