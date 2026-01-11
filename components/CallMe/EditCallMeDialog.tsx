"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CallMeForm, type CallMeFormValues } from "@/components/CallMe/CallMeForm";
import { useAdminContentLanguage } from "@/lib/context/AdminContentLanguageProvider";

export interface CallMeItem {
  id: string;
  label: string;
  type: "text" | "link";
  iconName: string;
  value: string;
  href?: string | null;
  order: number;
  isPublished: boolean;
}

interface EditCallMeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CallMeItem;
  onSuccess: () => void;
}

export function EditCallMeDialog({ open, onOpenChange, item, onSuccess }: EditCallMeDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const { language, withLanguage } = useAdminContentLanguage();

  const handleSubmit = async (values: CallMeFormValues) => {
    try {
      setSubmitting(true);
      const res = await fetch(withLanguage(`/api/admin/call-me/${item.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, language }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Update failed");
      }
      toast.success("已更新");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑联系方式</DialogTitle>
        </DialogHeader>

        <CallMeForm
          initialValues={{
            label: item.label,
            type: item.type,
            iconName: item.iconName,
            value: item.value,
            href: item.href || "",
          }}
          submitText={submitting ? "保存中..." : "保存"}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}


