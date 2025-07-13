"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useSWR from "swr";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface EditAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attachment: {
    id: string;
    name: string;
    isPublished: boolean;
    path: string;
    tags: { tag: Tag }[];
  };
  onSuccess: () => void;
}

export function EditAttachmentDialog({
  open,
  onOpenChange,
  attachment,
  onSuccess,
}: EditAttachmentDialogProps) {
  const [name, setName] = useState(attachment.name);
  const [isPublished, setIsPublished] = useState(attachment.isPublished);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    attachment.tags.map(t => t.tag)
  );
  const [openTagSelect, setOpenTagSelect] = useState(false);

  const { data: allTags = [] } = useSWR<Tag[]>("/api/tags", (url: string) =>
    fetch(url).then(res => res.json())
  );

  const availableTags = allTags.filter(
    tag => !selectedTags.some(selected => selected.id === tag.id)
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/attachments/${attachment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          isPublished,
          tags: selectedTags.map(tag => tag.id),
        }),
      });

      if (!res.ok) throw new Error("更新失败");
      
      toast.success("更新成功");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("更新失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("name", attachment.name);
    formData.append("tags", JSON.stringify([]));

    try {
      // 先上传新文件
      const uploadRes = await fetch("/api/admin/attachments", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("文件上传失败");
      const newFile = await uploadRes.json();

      // 更新文件信息，保持原有的名称和状态
      const updateRes = await fetch(`/api/admin/attachments/${newFile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          isPublished: isPublished,
          tags: [],
        }),
      });

      if (!updateRes.ok) throw new Error("信息更新失败");

      // 删除旧文件
      await fetch(`/api/admin/attachments/${attachment.id}`, {
        method: "DELETE",
      });

      toast.success("文件已更新");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("更新失败，请稍后重试");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑附件</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>文件名称</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入文件名称"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label>公开状态</Label>
          </div>

          <div className="space-y-2">
            <Label>标签</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    border: `1px solid ${tag.color}`
                  }}
                >
                  {tag.name}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.filter(t => t.id !== tag.id)
                      );
                    }}
                  />
                </span>
              ))}
            </div>

            <Popover open={openTagSelect} onOpenChange={setOpenTagSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTagSelect}
                  className="w-full justify-between"
                >
                  选择标签...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="搜索标签..." />
                  <CommandEmpty>未找到标签</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => {
                          setSelectedTags(prev => [...prev, tag]);
                          setOpenTagSelect(false);
                        }}
                      >
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}`
                          }}
                        >
                          {tag.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>更新文件</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 