import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { deleteFromS3 } from '@/lib/utils/s3';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

const updateSettingsSchema = z.object({
  websiteTitle: z.string().optional(),
  favicon: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching website settings');
    const language = getContentLanguageFromRequest(request);
    
    // 获取或创建默认设置
    let settings = await prisma.settings.findFirst({ where: { language } });
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          language,
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
    const language = getContentLanguageFromRequest(request);
    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);
    
    console.log('Updating website settings:', { 
      hasTitle: !!validatedData.websiteTitle,
      hasFavicon: validatedData.favicon !== undefined
    });
    
    // Get existing settings
    let settings = await prisma.settings.findFirst({ where: { language } });
    
    // If favicon is being set to null, delete old file from S3
    if (validatedData.favicon === null && settings?.favicon) {
      try {
        await deleteFromS3(settings.favicon);
      } catch (error) {
        console.error('Failed to delete old favicon:', error);
        // Continue with update, don't fail if delete fails
      }
    }
    
    if (settings) {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...(validatedData.websiteTitle !== undefined && { websiteTitle: validatedData.websiteTitle }),
          ...(validatedData.favicon !== undefined && { favicon: validatedData.favicon }),
        },
      });
      console.log('Updated existing settings');
    } else {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          language,
          websiteTitle: validatedData.websiteTitle || 'Resume Portfolio',
          favicon: validatedData.favicon ?? null,
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
