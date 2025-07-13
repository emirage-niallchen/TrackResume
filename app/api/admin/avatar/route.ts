

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || !body.avatar) {
      return NextResponse.json(
        { error: "头像数据不能为空" },
        { status: 400 }
      );
    }

    // 确保存储纯 base64 数据
    const base64Data = body.avatar.includes('base64,') 
      ? body.avatar.split('base64,')[1] 
      : body.avatar;

    // 获取第一个管理员
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { error: "未找到管理员账户" },
        { status: 404 }
      );
    }

    // 更新数据库中的头像
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: { avatar: base64Data },
    });

    return NextResponse.json({ avatar: updatedAdmin.avatar });
    
  } catch (error) {
    console.error("头像上传失败:", error);
    return NextResponse.json(
      { error: "头像上传失败" },
      { status: 500 }
    );
  }
} 