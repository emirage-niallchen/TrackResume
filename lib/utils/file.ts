import { File as FileIcon, FileText, FileImage } from "lucide-react";
import { PdfIcon } from '@/components/icons/pdf-icon';
import { VideoIcon } from '@/components/icons/video-icon';

/**
 * 根据文件类型返回对应的图标组件
 * @param type 文件的 MIME 类型
 */
export function getFileIcon(type: string) {
  // PDF 文件
  if (type === "application/pdf") return PdfIcon;
  // Word 文档
  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return FileText;
  // PNG、JPEG、JPG、GIF 等图片
  if (
    type === "image/png" ||
    type === "image/jpeg" ||
    type === "image/jpg" ||
    type === "image/gif" ||
    type.startsWith("image/")
  ) return FileImage;
  // 视频文件
  if (
    type === "video/mp4" ||
    type === "video/webm" ||
    type === "video/ogg" ||
    type.startsWith("video/")
  ) return VideoIcon;
  // 其他类型
  return FileIcon;
}

/**
 * 检查文件是否为视频类型
 * @param type 文件的 MIME 类型
 */
export function isVideoFile(type: string): boolean {
  return type.startsWith("video/");
} 