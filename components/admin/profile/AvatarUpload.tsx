'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface Props {
  currentAvatar?: string | null;
  onUpload: (base64: string) => Promise<void>;
}

export function AvatarUpload({ currentAvatar, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 解码Base64图片数据
  const getImageUrl = (base64String: string | null | undefined) => {
    if (!base64String) return null;
    // 如果已经是完整的 data URL，直接返回
    if (base64String.startsWith('data:image/')) {
      return base64String;
    }
    // 否则构造完整的 data URL
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error("请选择图片文件");
      return;
    }

    // 验证文件大小
    if (file.size > 512 * 1024 * 1024) {
      toast.error("文件大小超出限制");
      return;
    }

    try {
      setLoading(true);
      const base64 = await convertToBase64(file);
      const base64Data = base64.split(',')[1];
      await onUpload(base64Data);
      setPreviewUrl(base64);
      toast.success("头像上传成功");
    } catch (error) {
      console.error('头像上传失败:', error);
      toast.error("上传失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 使用当前预览URL或已有头像
  const displayUrl = previewUrl || getImageUrl(currentAvatar);

  return (
    <div className="space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="头像"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">暂无头像</span>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          asChild
          variant="outline"
          disabled={loading}
        >
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {loading ? '上传中...' : '更换头像'}
          </label>
        </Button>
      </div>
    </div>
  );
} 