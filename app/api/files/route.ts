import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { File ,Tag} from '@prisma/client';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export type FileVO = File&{
  tags: Tag[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');
    const language = getContentLanguageFromRequest(request);

    console.log('Files API - 查询参数:', { tags });
    console.log('Files API - 数据库连接状态: 正常');

    // 先查询所有文件数量，不限制 isPublished
    const allFilesCount = await prisma.file.count();
    console.log('Files API - 数据库中总文件数:', allFilesCount);

    // 查询已发布的文件数量
    const publishedFilesCount = await prisma.file.count({
      where: { isPublished: true }
    });
    console.log('Files API - 已发布文件数:', publishedFilesCount);

    const files = await prisma.file.findMany({
      where: {
        language,
        // 临时注释掉 isPublished 条件，返回所有文件
        // isPublished: true,
        ...(tags.length > 0 && {
          tags: {
            some: {
              tag: { name: { in: tags }, language }
            }
          }
        }),
      },
      include: {
        tags: {
          where: { tag: { language } },
          include: {
            tag: true
          }
        }
      },
    });
    
    console.log('Files API - 查询结果数量:', files.length);
    console.log('Files API - 返回数据:', JSON.stringify(files, null, 2));
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('获取文件数据失败:', error);
    return NextResponse.json({ error: '获取文件数据失败' }, { status: 500 });
  }
} 