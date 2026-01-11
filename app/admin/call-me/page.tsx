"use client";

import { CallMeForm, type CallMeFormValues } from "@/components/CallMe/CallMeForm";
import { CallMeList } from "@/components/CallMe/CallMeList";
import { toast } from "sonner";

export default function CallMePage() {
  const handleCreate = async (values: CallMeFormValues) => {
    const res = await fetch("/api/admin/call-me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Create failed");
    }
    toast.success("已创建");
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">联系方式管理</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">添加联系方式</h2>
          <CallMeForm
            onSubmit={async (values) => {
              await handleCreate(values);
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">列表</h2>
          <CallMeList />
        </div>
      </div>
    </div>
  );
}


