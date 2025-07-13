import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // 验证用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度至少6位" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      );
    }

    // 检查管理员是否存在
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    // 加密新密码
    const hashedPassword = await hash(password, 12);

    // 更新管理员密码
    await prisma.admin.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ msg: "密码修改成功" });
  } catch (error) {
    console.error("更新账号密码失败:", error);
    return NextResponse.json(
      { error: "更新账号密码失败" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = await prisma.admin.findFirst();

    console.log("admin.background", admin?.background);

    const customFields = await prisma.customField.findMany({
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