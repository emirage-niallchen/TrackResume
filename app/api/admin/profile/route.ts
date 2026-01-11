import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function PUT(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request);
    const data = await request.json();

    // 更新管理员基本信息
    const updatedAdmin = await prisma.admin.update({
      where: { id: data.id },
      data: {
        name: data.name,
        endpoint: data.endpoint,
        description: data.description,
      },
    });

    await prisma.customField.deleteMany({ where: { language } });

    // 创建新的自定义字段
    if (data.customFields && data.customFields.length > 0) {

      await prisma.customField.createMany({
        data: data.customFields.map((field: any, index: number) => ({
          language,
          label: field.label,
          value: field.value,
          type: field.type || 'text',
          order: index,
        })),
      });
    }

    // 返回更新后的完整数据
    const { password, ...adminData } = updatedAdmin;
    return NextResponse.json({
      ...adminData,
      customFields: data.customFields,
    });
  } catch (error) {
    console.error("更新个人资料失败:", error);
    return NextResponse.json(
      { error: "更新个人资料失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const language = getContentLanguageFromRequest(request);
    const admin = await prisma.admin.findFirst({ where: { language } });

    const customFields = await prisma.customField.findMany({
      where: { language },
      orderBy: { order: 'asc' },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "未找到管理员资料" },
        { status: 404 }
      );
    }

    const { password, ...adminData } = admin;
    return NextResponse.json({
      ...adminData,
      customFields,
    });
  } catch (error) {
    console.error("获取个人资料失败:", error);
    return NextResponse.json(
      { error: "获取个人资料失败" },
      { status: 500 }
    );
  }
} 