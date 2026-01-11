
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth';
import { uploadToS3 } from '@/lib/utils/s3';

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

    // Upload to S3
    const fileUrl = await uploadToS3(buffer, file.name, file.type, 'uploads');

    // 获取管理员ID（假设只有一个管理员账号）
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // 保存文件信息到数据库
    const savedFile = await prisma.file.create({
      data: {
        name: file.name,
        path: fileUrl,
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