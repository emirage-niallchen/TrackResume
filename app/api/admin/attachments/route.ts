import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/utils/s3";
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage";

export async function POST(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request);
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tags = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json(
        { error: "未上传文件" },
        { status: 400 }
      );
    }

    // Upload to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUrl = await uploadToS3(buffer, file.name, file.type, 'uploads');
    
    // 保存到数据库
    const fileRecord = await prisma.file.create({
      data: {
        language,
        name: file.name,
        path: fileUrl,
        type: file.type,
        size: file.size,
        tags: {
          create: JSON.parse(tags).map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      }
    });

    return NextResponse.json(fileRecord);
  } catch (error) {
    return NextResponse.json(
      { error: "上传失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const language = getContentLanguageFromRequest(request);
  const files = await prisma.file.findMany({
    where: { language },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return NextResponse.json(files);
} 