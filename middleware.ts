import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 允许直接访问登录页面
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }
  
  // 只保护管理页面
  if (req.nextUrl.pathname.startsWith("/admin")) {
    try {
      const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      
      // 如果访问的是 /admin 路径，重定向到 /admin/dashboard
      if (req.nextUrl.pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}; 