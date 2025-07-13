"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const baseSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string(),
  email: z.string().email("邮箱格式不正确"),
  name: z.string().optional()
});

const initSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不匹配",
  path: ["confirmPassword"],
});

type InitFormData = z.infer<typeof initSchema>;

export function InitForm() {
  const [formData, setFormData] = useState<InitFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: keyof InitFormData, value: string) => {
    try {
      const fieldSchema = baseSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (confirmPassword && password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "两次输入的密码不匹配" }));
    } else if (confirmPassword) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleChange = (field: keyof InitFormData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // 验证当前字段
    validateField(field, value);
    
    // 特殊处理密码和确认密码的匹配验证
    if (field === "password") {
      validateConfirmPassword(value, newFormData.confirmPassword);
    } else if (field === "confirmPassword") {
      validateConfirmPassword(newFormData.password, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 验证所有字段
      const validated = initSchema.parse(formData);
      
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '初始化失败');
      }
      
      toast.success('管理员账户创建成功，请登录');
      window.location.href = '/login';
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('请检查输入的信息');
      } else {
        toast.error(error instanceof Error ? error.message : '创建失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 检查表单是否有效
  const isFormValid = () => {
    return formData.username.trim() !== "" &&
           formData.password.length >= 6 &&
           formData.confirmPassword !== "" &&
           formData.password === formData.confirmPassword &&
           formData.email.trim() !== "" &&
           Object.keys(errors).length === 0;
  };

  return (
    <Card className="w-[400px] bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle>初始化管理员账户</CardTitle>
        <CardDescription>
          首次使用系统需要创建管理员账户，创建后将无法再次使用此功能
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="用户名"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
              disabled={isLoading}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="密码"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="确认密码"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="邮箱"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled={isLoading}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="姓名（可选）"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? '创建中...' : '创建账户'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 