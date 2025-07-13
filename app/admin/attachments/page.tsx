"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import useSWR from "swr";
import { formatBytes } from "@/lib/utils/formatBytes";
import { formatDate } from "@/lib/utils/dateFormatter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditAttachmentDialog } from "./components/EditAttachmentDialog";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface FileTag {
  tag: Tag;
}

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  createdAt: string;
  isPublished: boolean;
  tags: FileTag[];
}

export default function AttachmentsPage() {
  const [uploading, setUploading] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<AttachmentFile | null>(null);
  
  const { data: files, mutate, error, isLoading } = useSWR<AttachmentFile[]>(
    "/api/admin/attachments", 
    (url: string) => fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("tags", JSON.stringify([]));

    try {
      const res = await fetch("/api/admin/attachments", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("上传失败");

      toast.success("文件已成功上传");
      mutate();
    } catch (error) {
      toast.error("请稍后重试");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/attachments/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("删除失败");

      toast.success("文件已被删除");

      mutate();
    } catch (error) {
      toast.error("请稍后重试");
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/attachments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isPublished: !isPublished,
          tags: []
        })
      });

      if (!res.ok) throw new Error("更新失败");
      mutate();
    } catch (error) {
      toast.error("请稍后重试");
    }
  };

  const handleDownload = async (path: string, filename: string) => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("下载失败，请稍后重试");
    }
  };

  if (error) {
    return <div className="p-6">加载失败: {error.message}</div>;
  }

  if (isLoading) {
    return <div className="p-6">正在加载...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">附件管理</h1>
        <div className="flex items-center gap-4">
          <Button 
            disabled={uploading}
            onClick={() => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.onchange = async (e) => {
                const target = e.target as HTMLInputElement;
                if (!target.files?.length) return;
                
                setUploading(true);
                const formData = new FormData();
                formData.append("file", target.files[0]);
                formData.append("tags", JSON.stringify([]));
                
                try {
                  const res = await fetch("/api/admin/attachments", {
                    method: "POST",
                    body: formData
                  });

                  if (!res.ok) throw new Error("上传失败");
                  toast.success("文件已成功上传");
                  mutate();
                } catch (error) {
                  toast.error("请稍后重试");
                } finally {
                  setUploading(false);
                }
              };
              fileInput.click();
            }}
          >
            {uploading ? "上传中..." : "上传文件"}
          </Button>
        </div>
      </div>

      {files && files.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead>路径</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.name}</TableCell>
                  <TableCell className="text-sm text-gray-500">{file.path}</TableCell>
                  <TableCell>{file.size ? formatBytes(file.size) : '0 Bytes'}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>
                    {file.createdAt ? formatDate(new Date(file.createdAt)) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={file.isPublished}
                        onCheckedChange={() => 
                          handleTogglePublish(file.id, file.isPublished)
                        }
                      />
                      <span className="text-sm">
                        {file.isPublished ? '已公开' : '未公开'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}`
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file.path, file.name)}
                      >
                        下载
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAttachment(file)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          暂无附件
        </div>
      )}

      {editingAttachment && (
        <EditAttachmentDialog
          open={!!editingAttachment}
          onOpenChange={(open) => {
            if (!open) setEditingAttachment(null);
          }}
          attachment={editingAttachment}
          onSuccess={() => {
            mutate();
          }}
        />
      )}
    </div>
  );
} 