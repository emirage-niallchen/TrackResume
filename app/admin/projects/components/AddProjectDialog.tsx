"use client";

import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tag } from "@/lib/types";
import useSWR from "swr";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X, Upload, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";

/**
 * 项目表单数据校验规则
 */
const projectSchema = z.object({
  name: z.string().min(1, "项目名称不能为空"),
  jobRole: z.string().optional(),
  jobTech: z.string().optional(),
  description: z.string().min(1, "项目描述不能为空"),
  startTime: z.string().min(1, "请选择开始时间"),
  endTime: z.string().optional(),
  tags: z.array(z.object({ id: z.string(), name: z.string(), color: z.string() })),
  links: z.array(z.object({ label: z.string(), url: z.string() })),
  images: z.array(z.any()),
  isPublished: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  project?: any; // ProjectVO | undefined
}

/**
 * 新增项目弹窗组件
 * @param open 是否打开
 * @param onOpenChange 打开状态变更回调
 * @param onSuccess 成功回调
 * @param project 项目数据（可选）
 */
export const AddProjectDialog: React.FC<AddProjectDialogProps> = React.memo(({ open, onOpenChange, onSuccess, project }) => {
  const [loading, setLoading] = useState(false);
  const [openTagSelect, setOpenTagSelect] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<{ path: string; alt?: string }[]>([]);

  const { data: allTags = [] } = useSWR<Tag[]>("/api/tags", (url: string) =>
    fetch(url).then(res => res.json())
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      jobRole: "",
      jobTech: "",
      description: "",
      startTime: "",
      endTime: "",
      tags: [],
      links: [],
      images: [],
      isPublished: false,
    }
  });

  const selectedTags = watch("tags");
  const projectLinks = watch("links");
  const images = watch("images");

  const availableTags = allTags.filter(
    tag => !selectedTags.some((selected) => selected.id === tag.id)
  );

  React.useEffect(() => {
    if (project) {
      reset({
        name: project.name || "",
        jobRole: project.jobRole || "",
        jobTech: project.jobTech || "",
        description: project.description || "",
        startTime: project.startTime ? project.startTime.slice(0, 10) : "",
        endTime: project.endTime ? project.endTime.slice(0, 10) : "",
        tags: project.tags?.map((t: any) => t.tag) || [],
        links: project.links?.map((l: any) => ({ label: l.label, url: l.url })) || [],
        images: [], // 新图片
        isPublished: project.isPublished ?? false,
      });
      setOldImages(project.images?.map((img: any) => ({ path: img.path, alt: img.alt })) || []);
      setImagePreviewUrls(project.images?.map((img: any) => img.path) || []);
    } else {
      reset({
        name: "",
        jobRole: "",
        jobTech: "",
        description: "",
        startTime: "",
        endTime: "",
        tags: [],
        links: [],
        images: [],
        isPublished: false,
      });
      setOldImages([]);
      setImagePreviewUrls([]);
    }
  }, [project, reset]);

  /**
   * 处理图片上传
   */
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) toast.error(`${file.name} 格式不支持，仅支持 JPG/PNG/WebP`);
      if (!isValidSize) toast.error(`${file.name} 超过5MB限制`);
      return isValidType && isValidSize;
    });

    setValue("images", [...images, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, setValue]);

  /**
   * 添加项目链接
   */
  const handleAddLink = useCallback(() => {
    setValue("links", [...projectLinks, { label: "", url: "" }]);
  }, [projectLinks, setValue]);

  /**
   * 移除项目链接
   */
  const handleRemoveLink = useCallback((index: number) => {
    setValue("links", projectLinks.filter((_, i) => i !== index));
  }, [projectLinks, setValue]);

  /**
   * 表单提交
   */
  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("jobRole", data.jobRole || "");
      formDataToSend.append("jobTech", data.jobTech || "");
      formDataToSend.append("description", data.description);
      formDataToSend.append("startTime", data.startTime);
      formDataToSend.append("endTime", data.endTime || "");
      formDataToSend.append("tags", JSON.stringify(data.tags.map(tag => tag.id)));
      formDataToSend.append("links", JSON.stringify(data.links));
      // 旧图片
      formDataToSend.append("oldImages", JSON.stringify(oldImages));
      // 新图片
      data.images.forEach((img: File) => formDataToSend.append("images", img));
      formDataToSend.append("isPublished", String(data.isPublished));
      let res;
      if (project?.id) {
        // 编辑模式
        res = await fetch(`/api/admin/projects/${project.id}`, {
          method: "PUT",
          body: formDataToSend
        });
      } else {
        // 新增模式
        res = await fetch("/api/admin/projects", {
          method: "POST",
          body: formDataToSend
        });
      }
      if (!res.ok) throw new Error(await res.text());
      toast.success(project?.id ? "项目更新成功" : "项目创建成功");
      onSuccess();
      onOpenChange(false);
      reset();
      setImagePreviewUrls([]);
      setOldImages([]);
    } catch (error: any) {
      toast.error(error.message || (project?.id ? "更新失败" : "创建失败"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "编辑项目" : "添加项目"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 项目名称/角色 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">项目名称</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" required />
                )}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobRole">担任角色</Label>
              <Controller
                name="jobRole"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="jobRole" />
                )}
              />
            </div>
          </div>
          {/* 时间 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">开始时间</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="startTime" type="date" required />
                )}
              />
              {errors.startTime && <span className="text-red-500 text-xs">{errors.startTime.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">结束时间</Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="endTime" type="date" />
                )}
              />
            </div>
          </div>
          {/* 技术 */}
          <div className="space-y-2">
            <Label htmlFor="jobTech">使用技术</Label>
            <Controller
              name="jobTech"
              control={control}
              render={({ field }) => (
                <Input {...field} id="jobTech" />
              )}
            />
          </div>
          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">项目描述</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} id="description" required rows={4} />
              )}
            />
            {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
          </div>
          {/* 图片 */}
          <div className="space-y-2">
            <Label>项目图片</Label>
            <div className="flex flex-wrap gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => {
                      if (index < oldImages.length) {
                        setOldImages(prev => prev.filter((_, i) => i !== index));
                      } else {
                        setValue("images", images.filter((_: any, i: number) => i !== (index - oldImages.length)));
                      }
                      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Label
                htmlFor="images"
                className={cn(
                  "w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer",
                  "hover:border-primary hover:bg-primary/5"
                )}
              >
                <Upload className="w-6 h-6" />
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>
          {/* 链接 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>项目链接</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLink}>
                <Plus className="w-4 h-4 mr-1" />
                添加链接
              </Button>
            </div>
            <div className="space-y-2">
              {projectLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="链接标签"
                    value={link.label}
                    onChange={e => {
                      const newLinks = [...projectLinks];
                      newLinks[index].label = e.target.value;
                      setValue("links", newLinks);
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={e => {
                      const newLinks = [...projectLinks];
                      newLinks[index].url = e.target.value;
                      setValue("links", newLinks);
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {/* 标签 */}
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
                    onClick={() => setValue("tags", selectedTags.filter((t) => t.id !== tag.id))}
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
                    {availableTags.map((tag: Tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => {
                          setValue("tags", [...selectedTags, tag]);
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
          {/* 是否发布 */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isPublished"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isPublished"
                />
              )}
            />
            <Label htmlFor="isPublished">是否发布</Label>
          </div>
          {/* 操作按钮 */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
});

AddProjectDialog.displayName = "AddProjectDialog"; 