"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { callMeIconNames, getCallMeIcon } from "@/lib/utils";

export interface CallMeFormValues {
  label: string;
  type: "text" | "link";
  iconName: string;
  value: string;
  href?: string;
}

interface CallMeFormProps {
  initialValues?: Partial<CallMeFormValues>;
  submitText?: string;
  onSubmit: (values: CallMeFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function CallMeForm({
  initialValues,
  submitText = "创建",
  onSubmit,
  onCancel,
}: CallMeFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<CallMeFormValues>({
    label: initialValues?.label || "",
    type: initialValues?.type || "text",
    iconName: initialValues?.iconName || "Mail",
    value: initialValues?.value || "",
    href: initialValues?.href || "",
  });

  const IconPreview = useMemo(() => getCallMeIcon(values.iconName), [values.iconName]);

  const isLink = values.type === "link";

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
          const payload: CallMeFormValues = {
            label: values.label.trim(),
            type: values.type,
            iconName: values.iconName,
            value: values.value.trim(),
            ...(isLink && values.href?.trim() ? { href: values.href.trim() } : {}),
          };
          await onSubmit(payload);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="label">名称</Label>
        <Input
          id="label"
          value={values.label}
          onChange={(e) => setValues((prev) => ({ ...prev, label: e.target.value }))}
          placeholder="例如：邮箱 / GitHub / 微信"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>类型</Label>
        <Select
          value={values.type}
          onValueChange={(v) => setValues((prev) => ({ ...prev, type: v as "text" | "link" }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">文本</SelectItem>
            <SelectItem value="link">链接</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>图标（lucide-react）</Label>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md border flex items-center justify-center bg-background">
            <IconPreview className="h-5 w-5" />
          </div>
          <Select
            value={values.iconName}
            onValueChange={(v) => setValues((prev) => ({ ...prev, iconName: v }))}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="选择图标" />
            </SelectTrigger>
            <SelectContent>
              {callMeIconNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">{isLink ? "展示文本" : "内容"}</Label>
        <Input
          id="value"
          value={values.value}
          onChange={(e) => setValues((prev) => ({ ...prev, value: e.target.value }))}
          placeholder={isLink ? "例如：github.com/xxx" : "例如：admin@example.com"}
          required
        />
      </div>

      {isLink && (
        <div className="space-y-2">
          <Label htmlFor="href">链接地址</Label>
          <Input
            id="href"
            value={values.href || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, href: e.target.value }))}
            placeholder="https://..."
            required
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            取消
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "提交中..." : submitText}
        </Button>
      </div>
    </form>
  );
}


