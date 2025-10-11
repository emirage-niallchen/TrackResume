import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching website metadata for layout');
    
    // 获取网站设置
    const settings = await prisma.settings.findFirst();
    
    if (!settings) {
      // 如果没有设置，返回默认值
      return NextResponse.json({
        websiteTitle: 'Resume Portfolio',
        favicon: null,
      });
    }
    
    // 构造favicon的完整URL
    const faviconUrl = settings.favicon 
      ? `data:image/jpeg;base64,${settings.favicon}`
      : '/favicon.svg';
    
    console.log('Metadata fetched successfully', { 
      hasTitle: !!settings.websiteTitle,
      hasFavicon: !!settings.favicon 
    });
    
    return NextResponse.json({
      websiteTitle: settings.websiteTitle || 'Resume Portfolio',
      favicon: faviconUrl,
    });
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    
    // 返回默认值作为fallback
    return NextResponse.json({
      websiteTitle: 'Resume Portfolio',
      favicon: '/favicon.svg',
    });
  }
}
