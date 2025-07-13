"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Tech } from "@/lib/types";
import useSWR from "swr";
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
import {ChevronsUpDown, X, Upload } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface EditTechDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tech: Tech;
  onSuccess: () => void;
}

export function EditTechDialog({
  open,
  onOpenChange,
  tech,
  onSuccess
}: EditTechDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tech.name || "",
    description: tech.description || "",
    bgColor: tech.bgColor || "#000000",
    icon: tech.icon || ""
  });
  
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    tech.tags?.map(t => t.tag) || []
  );
  const [openTagSelect, setOpenTagSelect] = useState(false);

  const { data: allTags = [] } = useSWR<Tag[]>("/api/tags", (url: string) =>
    fetch(url).then(res => res.json())
  );

  const availableTags = allTags.filter(
    tag => !selectedTags.some(selected => selected.id === tag.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = tech.id 
        ? `/api/admin/tech/${tech.id}`
        : "/api/admin/tech";
      
      const res = await fetch(url, {
        method: tech.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags.map(tag => tag.id)
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "保存失败");
      }

      toast.success(tech.id ? "更新成功" : "创建成功");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "操作失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('请上传 JPG、PNG 或 SVG 格式的图片');
      return;
    }

    // 检查文件大小（例如限制为 2MB）
    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 2MB');
      return;
    }

    try {
      if (file.type === 'image/svg+xml') {
        // 对于 SVG 文件，直接读取文本内容
        const text = await file.text();
        setFormData(prev => ({
          ...prev,
          icon: text
        }));
      } else {
        // 对于其他图片格式，转换为 base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            icon: base64String
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('图片处理失败:', error);
      toast.error('图片处理失败，请重试');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tech.id ? "编辑技术栈" : "添加技术栈"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bgColor">背景颜色</Label>
            <div className="flex gap-2">
              <Input
                id="bgColor"
                type="color"
                value={formData.bgColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bgColor: e.target.value
                }))}
                required
              />
              <Input
                value={formData.bgColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bgColor: e.target.value
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>图标</Label>
            <div className="flex items-center gap-4">
              {formData.icon && (
                <div className="relative w-16 h-16 border rounded overflow-hidden">
                  <img
                    src={formData.icon}
                    alt="Tech icon"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 w-6 h-6"
                    onClick={() => setFormData(prev => ({ ...prev, icon: "" }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="icon" className="cursor-pointer">
                  <div className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>选择图标文件</span>
                  </div>
                  <Input
                    id="icon"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleIconUpload}
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  支持 PNG、JPG、SVG 格式，大小不超过 2MB, 推荐使用 SVG 格式，过大真的转不动。
                </p>
              </div>
            </div>
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
                  type="button"
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 