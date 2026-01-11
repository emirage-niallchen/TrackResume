import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3";
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage";

export async function POST(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request);
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "头像文件不能为空" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "请上传图片文件" },
        { status: 400 }
      );
    }

    // 获取第一个管理员
    const admin = await prisma.admin.findFirst({ where: { language } });
    if (!admin) {
      return NextResponse.json(
        { error: "未找到管理员账户" },
        { status: 404 }
      );
    }

    // 如果已有头像，先删除S3中的旧文件
    if (admin.avatar) {
      try {
        await deleteFromS3(admin.avatar);
      } catch (error) {
        console.error("删除旧头像失败:", error);
        // 继续上传新文件，不因删除失败而中断
      }
    }

    // 上传文件到S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUrl = await uploadToS3(buffer, file.name, file.type, 'admin/avatar');

    // 更新数据库中的头像URL
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: { avatar: fileUrl },
    });

    return NextResponse.json({ avatar: updatedAdmin.avatar });
    
  } catch (error) {
    console.error("头像上传失败:", error);
    return NextResponse.json(
      { error: "头像上传失败" },
      { status: 500 }
    );
  }
}
