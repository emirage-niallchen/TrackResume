"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { log } from "console";

interface Props {
  currentBackground?: string | null;
  onUpload: (base64: string) => Promise<void>;
}

export function BackgroundUpload({ currentBackground, onUpload }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 解码Base64图片数据
  const getImageUrl = (base64String: string | null | undefined) => {
    if (!base64String) return null;
    if (base64String.startsWith("data:image/")) {
      return base64String;
    }
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }

    if (file.size > 512 * 1024 * 1024) {
      toast.error("文件大小超出限制");
      return;
    }


    try {
      setLoading(true);
      const base64 = await convertToBase64(file);
      const base64Data = base64.split(",")[1];
      await onUpload(base64Data);
      setPreviewUrl(base64);
      toast.success("背景图上传成功");
    } catch (error) {
      console.error("背景图上传失败:", error);
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
