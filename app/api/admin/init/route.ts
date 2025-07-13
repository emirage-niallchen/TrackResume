

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const initSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string(),
  email: z.string().email("邮箱格式不正确"),
  name: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

export async function POST(request: Request) {
  try {
    const adminExists = await prisma.admin.findFirst();
    if (adminExists) {
      return NextResponse.json(
        { error: '管理员账户已存在' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const validated = initSchema.parse(data);
    
    const hashedPassword = await hash(validated.password, 12);

    const admin = await prisma.admin.create({
      data: {
        username: validated.username,
        password: hashedPassword,
        email: validated.email,
        name: validated.name ?? '',
        description: ''
      },
    });

    // 移除密码字段后返回
    const { password: _, ...adminWithoutPassword } = admin;
    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '创建管理员账户失败' },
      { status: 500 }
    );
  }
} 