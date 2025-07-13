"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import useSWR from 'swr';

export default function SectionsManagePage() {
  const router = useRouter();
  const { data: sections, mutate } = useSWR('/api/sections');

  const toggleSection = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/sections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: enabled }),
      });
      mutate(); // 重新获取数据
    } catch (error) {
      console.error('更新部分状态失败:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">简历部分管理</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>排序</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections?.map((section: any) => (
            <TableRow key={section.id}>
              <TableCell>{section.label}</TableCell>
              <TableCell>{section.type}</TableCell>
              <TableCell>{section.order}</TableCell>
              <TableCell>
                <Switch
                  checked={section.isEnabled}
                  onCheckedChange={(checked) => toggleSection(section.id, checked)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/sections/${section.id}`)}
                >
                  编辑
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 