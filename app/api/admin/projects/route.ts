
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3";

/**
 * 处理项目创建请求
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const jobRole = formData.get("jobRole") as string;
    const jobTech = formData.get("jobTech") as string;
    const description = formData.get("description") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const links = JSON.parse(formData.get("links") as string);
    const images = formData.getAll("images") as File[];
    const isPublished = formData.get("isPublished") === "true";

    // 创建项目
    const project = await prisma.project.create({
      data: {
        name,
        jobRole,
        jobTech,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        isPublished,
        tags: {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        },
        links: {
          create: links.map((link: { label: string; url: string }) => ({
            label: link.label,
            url: link.url
          }))
        }
      }
    });

    // 处理图片上传到S3
    if (images.length > 0) {
      for (const image of images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileUrl = await uploadToS3(buffer, image.name, image.type, 'project/images');

        await prisma.projectImage.create({
          data: {
            path: fileUrl,
            project: {
              connect: { id: project.id }
            }
          }
        });
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const jobRole = formData.get("jobRole") as string;
    const jobTech = formData.get("jobTech") as string;
    const description = formData.get("description") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const links = JSON.parse(formData.get("links") as string);
    const oldImages = JSON.parse(formData.get("oldImages") as string);
    const images = formData.getAll("images") as File[];
    const isPublished = formData.get("isPublished") === "true";

    // 更新项目
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        jobRole,
        jobTech,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        isPublished,
        tags: {
          deleteMany: {},
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        },
        links: {
          deleteMany: {},
          create: links.map((link: { label: string; url: string }) => ({
            label: link.label,
            url: link.url
          }))
        }
      }
    });

    // 处理图片
    // 删除旧图片（从S3和数据库）
    const imagesToDelete = await prisma.projectImage.findMany({
      where: {
        projectId: id,
        path: {
          notIn: oldImages.map((img: any) => img.path)
        }
      }
    });

    // Delete from S3
    for (const image of imagesToDelete) {
      try {
        await deleteFromS3(image.path);
      } catch (error) {
        console.error(`Failed to delete image from S3: ${image.path}`, error);
      }
    }

    // Delete from database
    await prisma.projectImage.deleteMany({
      where: {
        projectId: id,
        path: {
          notIn: oldImages.map((img: any) => img.path)
        }
      }
    });

    // 上传新图片到S3
    if (images.length > 0) {
      for (const image of images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileUrl = await uploadToS3(buffer, image.name, image.type, 'project/images');

        await prisma.projectImage.create({
          data: {
            path: fileUrl,
            project: {
              connect: { id: project.id }
            }
          }
        });
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: true,
        links: true,
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

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "获取项目列表失败" },
      { status: 500 }
    );
  }
} 