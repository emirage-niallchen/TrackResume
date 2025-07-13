

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const adminCount = await prisma.admin.count()
    
    return NextResponse.json({
      exists: adminCount > 0,
      count: adminCount,
    })
  } catch (error) {
    console.error("检查管理员失败:", error)
    return NextResponse.json(
      { error: "检查失败" },
      { status: 500 }
    )
  }
} 