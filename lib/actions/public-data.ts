import { prisma } from "@/lib/prisma";

/**
 * 获取前台展示所需的所有公开数据
 */
export async function getPublicData() {
  // 获取管理员信息
  const admin = await prisma.admin.findFirst({
    select: {
      name: true,
      description: true,
      avatar: true,
      email: true,
    },
  });

  // 获取技术栈
  const techs = await prisma.tech.findMany({
    where: { isPublished: true },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { order: 'asc' },
  });

  // 获取项目
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    include: {
      images: true,
      links: {
        orderBy: { order: 'asc' },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { order: 'asc' },
  });

  // 获取简历部分
  const resumes = await prisma.resume.findMany({
    where: { isPublished: true },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { order: 'asc' },
  });

  // 获取简历部分配置
  const resumeSections = await prisma.resumeSection.findMany({
    where: { 
      isPublished: true,
      isEnabled: true,
    },
    orderBy: { order: 'asc' },
  });

  // 获取自定义字段
  const customFields = await prisma.customField.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });

  // 获取位置信息
  const location = await prisma.location.findFirst();

  // 获取可下载文件
  const files = await prisma.file.findMany({
    where: { isPublished: true },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return {
    admin,
    techs,
    projects,
    resumes,
    resumeSections,
    customFields,
    location,
    files,
  };
} 