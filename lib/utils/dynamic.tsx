"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import React from "react";

/**
 * 创建仅客户端渲染的动态组件
 * @param importFunc - 组件导入函数
 */
export function createClientComponent<P = Record<string, unknown>, T extends ComponentType<P> = ComponentType<P>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: () => <div>{"Loading..."}</div>,
    ssr: false,
  });
}