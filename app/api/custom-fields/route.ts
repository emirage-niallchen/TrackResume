import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getContentLanguageFromRequest, contentLanguageSchema } from '@/lib/validations/contentLanguage';

// 强制动态渲染，避免静态生成
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  language: contentLanguageSchema.optional(),
  label: z.string(),
  value: z.string(),
  type: z.string(),
  description: z.string().optional(),
  order: z.number().default(0),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const label = searchParams.get('label');
    const language = getContentLanguageFromRequest(request);
    
    console.log('Custom Fields API - 查询参数:', { label });
    console.log('Custom Fields API - 数据库连接状态: 正常');
    
    // 直接用 prisma 查询，不要 connect/disconnect
    const allFieldsCount = await prisma.customField.count({ where: { language } });
    const publishedFieldsCount = await prisma.customField.count({
      where: { isPublished: true, language }
    });
    
    const customFields = await prisma.customField.findMany({
      where: {
        language,
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

export async function POST(request: NextRequest) {
  try {
    const baseLanguage = getContentLanguageFromRequest(request);
    const parsed = createSchema.parse(await request.json());

    const language = parsed.language ?? baseLanguage;
    const customField = await prisma.customField.create({
      data: {
        ...parsed,
        language,
      },
    });
    return NextResponse.json(customField);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Failed to create custom field:', error);
    return NextResponse.json({ error: 'Failed to create custom field' }, { status: 500 });
  }
}
