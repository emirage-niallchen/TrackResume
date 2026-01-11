import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getContentLanguageFromRequest } from '@/lib/validations/contentLanguage';

export async function GET(request: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(request);
    console.log('Website metadata: fetch', { language });
    
    // 获取网站设置
    const settings = await prisma.settings.findFirst({ where: { language } });
    
    if (!settings) {
      // 如果没有设置，返回默认值
      return NextResponse.json({
        websiteTitle: 'Resume Portfolio',
        favicon: null,
      });
    }
    
    // Return favicon URL (already S3 URL, or default)
    const faviconUrl = settings.favicon || '/favicon.svg';
    
    console.log('Website metadata: fetched', { 
      hasTitle: !!settings.websiteTitle,
      hasFavicon: !!settings.favicon 
    });
    
    return NextResponse.json({
      websiteTitle: settings.websiteTitle || 'Resume Portfolio',
      favicon: faviconUrl,
    });
  } catch (error) {
    console.error('Website metadata: fetch failed', error);
    
    // 返回默认值作为fallback
    return NextResponse.json({
      websiteTitle: 'Resume Portfolio',
      favicon: '/favicon.svg',
    });
  }
}
