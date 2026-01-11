"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomFieldItem from "./CustomFieldItem";
import { toast } from "sonner";
import { PlusCircle, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { AvatarUpload } from "./AvatarUpload";
import { BackgroundUpload } from "./BackgroundUpload";
import { useAdminContentLanguage } from "@/lib/context/AdminContentLanguageProvider";
const profileSchema = z.object({
  id: z.string().optional(),
  avatar: z.string().optional(),
  background: z.string().optional(),
  name: z.string().min(1, "名称至少2个字符"),
  // email: z.string().email("请输入有效的邮箱地址"),
  endpoint: z.string().url("请输入有效的URL").optional(),
  description: z.string(),
  customFields: z.array(z.object({
    id: z.string().optional(),
    label: z.string().min(1, "字段名称不能为空"),
    value: z.string().min(1, "字段值不能为空"),
    type: z.string().default('text'),
    order: z.number().optional(),
  }))
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileManager() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const { withLanguage } = useAdminContentLanguage();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: "",
      name: "",
      endpoint: "",
      description: "",
      customFields: [],
    },
  });

  const customFields = form.watch("customFields");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(withLanguage("/api/admin/profile"));
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          form.reset({
            ...data,
            avatar: data.avatar || "",
            background: data.background || "",
          });
        }
      } catch (error) {
        console.error("获取个人资料失败:", error);
        toast.error("获取个人资料失败");
      }
    };
    fetchProfile();
  }, [form, withLanguage]);

  const handleAvatarUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(withLanguage("/api/admin/avatar"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("头像上传失败");

      const data = await response.json();
      form.setValue("avatar", data.avatar);
      
      const profileResponse = await fetch(withLanguage("/api/admin/profile"));
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      }
      
      toast.success("头像已更新");
    } catch (error) {
      toast.error("上传失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpload = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(withLanguage("/api/admin/background"), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("背景图上传失败");

      const data = await response.json();
      form.setValue("background", data.background);

      const profileResponse = await fetch(withLanguage("/api/admin/profile"));
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      }

      toast.success("背景图已更新");
    } catch (error) {
      toast.error("上传失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const addCustomField = () => {
    const currentFields = form.getValues("customFields");
    form.setValue("customFields", [
      ...currentFields,
      { label: "", value: "", type: "text" },
    ]);
  };

  const removeCustomField = (index: number) => {
    const currentFields = form.getValues("customFields");
    form.setValue(
      "customFields",
      currentFields.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const { avatar, background, ...submitData } = data;
      
      const response = await fetch(withLanguage("/api/admin/profile"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error("更新失败");

      toast.success("基础信息已更新");
    } catch (error) {
      toast.error("更新失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <AvatarUpload
            currentAvatar={form.watch("avatar")}
            onUpload={handleAvatarUpload}
          />
        </div>
        
        <div className="mb-6">
          <BackgroundUpload
            currentBackground={form.watch("background")}
            onUpload={handleBackgroundUpload}
          />
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>称呼</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网站地址</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} type="url" className="pr-10" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <span className="absolute inset-y-0 right-2 flex items-center cursor-pointer" tabIndex={0}>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto text-sm" side="top" align="end">
                      站点名称用于在标签管理界面生成自定义访问链接
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">自定义字段</h3>

          </div>

          {customFields.map((_, index) => (
            <CustomFieldItem
              key={index}
              index={index}
              form={form}
              onRemove={() => removeCustomField(index)}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomField}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            添加字段
          </Button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : "保存更改"}
        </Button>
      </form>
            
    </Form>

  );
} 