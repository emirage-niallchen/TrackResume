import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const label = searchParams.get('label');
    
    console.log('Custom Fields API - 查询参数:', { label });
    console.log('Custom Fields API - 数据库连接状态: 正常');
    
    // 直接用 prisma 查询，不要 connect/disconnect
    const allFieldsCount = await prisma.customField.count();
    const publishedFieldsCount = await prisma.customField.count({
      where: { isPublished: true }
    });
    
    const customFields = await prisma.customField.findMany({
      where: {
        ...(label && { label: { contains: label } }),
      },
      orderBy: { order: 'asc' }
    });
    
    console.log('Custom Fields API - 查询结果数量:', customFields.length);
    console.log('Custom Fields API - 返回数据:', JSON.stringify(customFields, null, 2));
    
    return NextResponse.json(customFields);
  } catch (error) {
    console.error('获取自定义字段失败:', error);
    
    // 检查是否是连接错误
    if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
      return NextResponse.json({ 
        error: '数据库连接失败，请检查网络连接或数据库服务器状态',
        details: 'Connection timeout or server unreachable'
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: '获取自定义字段失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
