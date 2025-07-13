

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth';
import path from 'path';

export async function POST(request: Request) {
  try {
    const authResult = await checkAuth();
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一的文件名
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    await writeFile(filePath, buffer);

    // 获取管理员ID（假设只有一个管理员账号）
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // 保存文件信息到数据库
    const savedFile = await prisma.file.create({
      data: {
        name: file.name,
        path: `/uploads/${fileName}`,
        type: file.type,
        size: buffer.length
      },
    });

    return NextResponse.json(savedFile);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 