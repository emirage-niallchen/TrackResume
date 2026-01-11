
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3";
import { extname } from "path";
import { prisma } from "@/lib/prisma";
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage";

export async function POST(req: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(req);
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("id") as string;
    if (!file || !projectId) {
      return NextResponse.json({ error: "缺少文件或项目ID" }, { status: 400 });
    }

    // 查询项目，准备清理旧的详情文件
    const project = await prisma.project.findFirst({
      where: { id: projectId, language }
    });
    if (!project) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }

    // 如果已有详情路径，先尝试从 S3 删除旧文件
    if (project?.detail) {
      try {
        await deleteFromS3(project.detail);
      } catch (error) {
        console.error("删除旧详情文件失败:", error);
      }
    }

    // 获取扩展名
    const originalName = file.name;
    const ext = extname(originalName);
    const fileName = `${projectId}_detail${ext}`;

    // 上传到 S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileUrl = await uploadToS3(buffer, fileName, file.type, "project/details");

    // 将详情路径写入项目表
    await prisma.project.update({
      where: { id: projectId },
      data: {
        detail: fileUrl,
      },
    });

    return NextResponse.json({ path: fileUrl });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 });
  }
}
