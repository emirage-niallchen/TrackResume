import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Debug API - 开始检查数据库状态');
    
    // 检查各个表的数据数量
    const stats = {
      files: {
        total: await prisma.file.count(),
        published: await prisma.file.count({ where: { isPublished: true } }),
        unpublished: await prisma.file.count({ where: { isPublished: false } })
      },
      customFields: {
        total: await prisma.customField.count(),
        published: await prisma.customField.count({ where: { isPublished: true } }),
        unpublished: await prisma.customField.count({ where: { isPublished: false } })
      },
      techs: {
        total: await prisma.tech.count(),
        published: await prisma.tech.count({ where: { isPublished: true } }),
        unpublished: await prisma.tech.count({ where: { isPublished: false } })
      },
      projects: {
        total: await prisma.project.count(),
        published: await prisma.project.count({ where: { isPublished: true } }),
        unpublished: await prisma.project.count({ where: { isPublished: false } })
      },
      tags: {
        total: await prisma.tag.count(),
        published: await prisma.tag.count({ where: { isPublished: true } }),
        unpublished: await prisma.tag.count({ where: { isPublished: false } })
      },
      admins: {
        total: await prisma.admin.count()
      }
    };
    
    console.log('Debug API - 数据库统计:', JSON.stringify(stats, null, 2));
    
    return NextResponse.json({
      message: '数据库状态检查完成',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug API - 检查失败:', error);
    return NextResponse.json({ 
      error: '数据库检查失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 