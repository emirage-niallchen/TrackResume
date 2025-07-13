'use client';

import { useState } from 'react';
import { CustomField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface Props {
  onSubmit: (data: Partial<CustomField>) => Promise<void>;
  initialData?: CustomField;
}

/**
 * 自定义字段表单组件
 * @param props - 组件属性
 */
export function CustomFieldForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    value: initialData?.value || '',
    type: initialData?.type || 'text',
    description: initialData?.description || '',
    order: initialData?.order || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">字段名称</label>
        <Input
          value={formData.label}
          onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">字段类型</label>
        <Select
          value={formData.type}
          onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
        >
          <option value="text">文本</option>
          <option value="link">链接</option>
          <option value="email">邮箱</option>
          <option value="phone">电话</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">字段值</label>
        <Input
          value={formData.value}
          onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">描述（可选）</label>
        <Input
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">排序</label>
        <Input
          type="number"
          value={formData.order}
          onChange={e => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
          required
        />
      </div>

      <Button type="submit">
        {initialData ? '更新' : '创建'}
      </Button>
    </form>
  );
} 