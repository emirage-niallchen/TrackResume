import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    console.log('Refreshing website settings cache');
    
    // 重新验证所有相关路径
    revalidatePath('/', 'layout');
    revalidatePath('/admin');
    revalidatePath('/admin/profile');
    
    console.log('Website settings cache refreshed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache refreshed successfully' 
    });
  } catch (error) {
    console.error('Failed to refresh cache:', error);
    return NextResponse.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    );
  }
}
