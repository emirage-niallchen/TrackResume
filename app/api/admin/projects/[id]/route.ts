

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { date, z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// 校验编辑参数
const updateProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  jobRole: z.string().nullable().optional(),
  jobTech: z.string().nullable().optional(),
  startTime: z.string(),
  endTime: z.string().nullable().optional(),
  isPublished: z.boolean(),
  images: z.array(
    z.object({
      path: z.string(),
      alt: z.string().optional(),
    })
  ),
  tags: z.array(z.string()),
});

// 编辑项目
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {

    console.log("编辑项目");

    const id = params.id;
    // 判断请求类型
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      // 处理 multipart/form-data
      const formData = await req.formData();
      const links = JSON.parse(formData.get("links") as string || "[]");
      // 解析基本信息
      const name = formData.get("name") as string;
      const jobRole = formData.get("jobRole") as string;
      const jobTech = formData.get("jobTech") as string;
      const description = formData.get("description") as string;
      const startTime = formData.get("startTime") as string;
      const endTime = formData.get("endTime") as string;
      const isPublished = formData.get("isPublished") === "true";
      // 解析标签和链接
      const tags = JSON.parse(formData.get("tags") as string);
      console.log("tags", tags);
      // 处理图片上传
      const images = formData.getAll("images") as File[];
      const oldImages = JSON.parse(formData.get("oldImages") as string || "[]"); // 前端传递保留的图片
      const uploadDir = join(process.cwd(), "public/uploads/projects");
      await mkdir(uploadDir, { recursive: true });
      // 保存新上传图片
      const savedImages = await Promise.all(
        images.map(async (image) => {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${image.name}`;
          const filePath = join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          return {
            path: `/uploads/projects/${fileName}`,
            alt: image.name
          };
        })
      );
      // 合并保留图片和新图片
      const allImages = [...oldImages, ...savedImages];
      // 更新项目（不再 set tags）
      const updated = await prisma.project.update({
        where: { id },
        data: {
          name,
          jobRole,
          jobTech,
          description,
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null,
          isPublished,
          images: {
            deleteMany: {}, // 先清空
            create: allImages
          },
          // tags 字段不要 set 了
        },
        include: {
          images: true,
          tags: { include: { tag: true } }
        },
      });

      // 正确更新标签：先删后增 ProjectTag
      await prisma.projectTag.deleteMany({ where: { projectId: id } });
      if (tags.length > 0) {
        await prisma.projectTag.createMany({
          data: tags.map((tagId: string) => ({
            projectId: id,
            tagId,
          })),
        });
      }

      await prisma.projectLink.deleteMany({ where: { projectId: id } });
      await prisma.projectLink.createMany({
        data: links.map((link: any) => ({
          projectId: id,
          ...link
        })),
      });
      return NextResponse.json({ success: true, data: updated });
    } else {
      // 兼容原有 JSON 方式
      const body = await req.json();

      const updated = await prisma.project.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          jobRole: body.jobRole,
          jobTech: body.jobTech,
          startTime: new Date(body.startTime),
          endTime: body.endTime ? new Date(body.endTime) : null,
          isPublished: body.isPublished,
          images: {
            set: [],
            create: body.images,
          },
          tags: {
            set: body.tags.map((tagId: string) => ({ id: tagId })),
          },
        },
        include: {
          images: true,
          tags: { include: { tag: true } }
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 删除项目
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
