"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { log } from "console";

interface Props {
  currentBackground?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export function BackgroundUpload({ currentBackground, onUpload }: Props) {
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

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.error("文件大小不能超过10MB");
      return;
    }

    try {
      setLoading(true);
      // 创建预览URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      // 上传文件
      await onUpload(file);
      toast.success("背景图上传成功");
    } catch (error) {
      console.error("背景图上传失败:", error);
      toast.error("上传失败，请稍后重试");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const displayUrl = previewUrl || getImageUrl(currentBackground);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-center">

        <div className="relative max-w-[50vw] w-full flex justify-center items-center">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="背景图"
              layout="intrinsic"
              width={800}
              height={400}
              className="object-contain rounded-lg"
              style={{ width: '100%', height: 'auto', maxWidth: '50vw' }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500">暂无背景图</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="background-upload"
        />
        <Button
          asChild
          variant="outline"
          disabled={loading}
        >
          <label htmlFor="background-upload" className="cursor-pointer">
            {loading ? "上传中..." : "更换背景图"}
          </label>
        </Button>
      </div>
    </div>
  );
}
