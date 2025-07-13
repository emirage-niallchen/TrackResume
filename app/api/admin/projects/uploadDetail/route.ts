

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("id") as string;
    if (!file || !projectId) {
      return NextResponse.json({ error: "缺少文件或项目ID" }, { status: 400 });
    }

    // 获取扩展名
    const originalName = file.name;
    const ext = extname(originalName);
    const fileName = `${projectId}_detail${ext}`;
    const dir = join(process.cwd(), "public", "project", "details");
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    const filePath = join(dir, fileName);

    // 如果文件已存在，先删除
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);
    const publicPath = `/project/details/${fileName}`;
    return NextResponse.json({ path: publicPath });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 });
  }
}
