'use client';

import { useCallback, useEffect, useState } from 'react';
import { CustomField } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useAdminContentLanguage } from '@/lib/context/AdminContentLanguageProvider';

/**
 * 自定义字段列表组件
 */
export function CustomFieldList() {
  const [fields, setFields] = useState<CustomField[]>([]);
  const { withLanguage } = useAdminContentLanguage();

  const fetchFields = useCallback(async () => {
    const response = await fetch(withLanguage('/api/custom-fields'));
    const data = await response.json();
    setFields(data);
  }, [withLanguage]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const togglePublish = async (id: string, isPublished: boolean) => {
    await fetch(withLanguage(`/api/custom-fields/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished })
    });
    fetchFields();
  };

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div 
          key={field.id}
          className="border p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium">{field.label}</h3>
            <p className="text-sm text-gray-500">{field.description}</p>
            <p className="text-sm">{field.value}</p>
          </div>
          <div className="space-x-2">
            <Button
              variant={field.isPublished ? 'default' : 'outline'}
              onClick={() => togglePublish(field.id, !field.isPublished)}
            >
              {field.isPublished ? '已发布' : '未发布'}
            </Button>
            <Button variant="outline">编辑</Button>
          </div>
        </div>
      ))}
    </div>
  );
} 