import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tags = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json(
        { error: "未上传文件" },
        { status: 400 }
      );
    }

    // 生成文件存储路径
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);
    
    // 写入文件
    await writeFile(filepath, buffer);
    
    // 保存到数据库
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        path: `/uploads/${filename}`,
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

export async function GET() {
  const files = await prisma.file.findMany({
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