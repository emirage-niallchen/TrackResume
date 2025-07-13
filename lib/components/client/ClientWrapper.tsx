"use client";

import { useEffect, useState } from "react";

interface ClientWrapperProps {
  children: React.ReactNode;
}

/**
 * 客户端渲染包装器组件
 * 用于解决服务端和客户端渲染不一致的问题
 */
export function ClientWrapper({ children }: ClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
} 