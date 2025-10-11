import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  websiteTitle: z.string().optional(),
  favicon: z.string().optional(),
});

export async function GET() {
  try {
    console.log('Fetching website settings');
    
    // 获取或创建默认设置
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          websiteTitle: 'Resume Portfolio',
          favicon: null,
        },
      });
      console.log('Created default settings');
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);
    
    console.log('Updating website settings:', { 
      hasTitle: !!validatedData.websiteTitle,
      hasFavicon: !!validatedData.favicon 
    });
    
    // 获取现有设置或创建新设置
    let settings = await prisma.settings.findFirst();
    
    if (settings) {
      // 更新现有设置
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: validatedData,
      });
      console.log('Updated existing settings');
    } else {
      // 创建新设置
      settings = await prisma.settings.create({
        data: {
          websiteTitle: validatedData.websiteTitle || 'Resume Portfolio',
          favicon: validatedData.favicon || null,
        },
      });
      console.log('Created new settings');
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update website settings' },
      { status: 500 }
    );
  }
}
