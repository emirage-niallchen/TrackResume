'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';

interface Props {
  currentAvatar?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentAvatar, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 获取图片URL（S3 URL）
  const getImageUrl = (imageData: string | null | undefined) => {
    if (!imageData) return null;
    // 直接返回S3 URL
    return imageData;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error("请选择图片文件");
      return;
    }

    // 验证文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error("文件大小不能超过5MB");
      return;
    }

    try {
      setLoading(true);
      // 创建预览URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      // 上传文件
      await onUpload(file);
      toast.success("头像上传成功");
    } catch (error) {
      console.error('头像上传失败:', error);
      toast.error("上传失败，请稍后重试");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
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