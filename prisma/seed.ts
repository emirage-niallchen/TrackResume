import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  await prisma.inbox.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tech.deleteMany();
  await prisma.file.deleteMany();

  // 创建一些测试数据
  await prisma.inbox.createMany({
    data: [
      {
        type: 'email',
        value: 'test@example.com',
        description: '测试消息1',
        isRead: false
      },
      {
        type: 'phone',
        value: '13800138000',
        description: '测试消息2',
        isRead: false
      }
    ]
  });

  await prisma.project.createMany({
    data: [
      {
        name: '个人简历项目',
        description: '基于Next.js的个人简历展示平台',
        isPublished: true,
        order: 1
      },
      {
        name: '博客系统',
        description: '个人技术博客系统',
        isPublished: true,
        order: 2
      }
    ]
  });

  await prisma.tech.createMany({
    data: [
      {
        name: 'React',
        description: 'React前端框架',
        bgColor: '#61dafb',
        isPublished: true,
        order: 1
      },
      {
        name: 'Next.js',
        description: 'Next.js框架',
        bgColor: '#000000',
        isPublished: true,
        order: 2
      },
      {
        name: 'TypeScript',
        description: 'TypeScript语言',
        bgColor: '#3178c6',
        isPublished: true,
        order: 3
      }
    ]
  });

  await prisma.file.createMany({
    data: [
      {
        name: '简历.pdf',
        path: '/files/resume.pdf',
        type: 'application/pdf',
        size: 1024,
        isPublished: true
      },
      {
        name: '头像.jpg',
        path: '/files/avatar.jpg',
        type: 'image/jpeg',
        size: 512,
        isPublished: true
      }
    ]
  });

  console.log('数据库初始化完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 