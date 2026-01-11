"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getCallMeIcon } from "@/lib/utils";
import { EditCallMeDialog, type CallMeItem } from "@/components/CallMe/EditCallMeDialog";

export function CallMeList() {
  const [items, setItems] = useState<CallMeItem[]>([]);
  const [editing, setEditing] = useState<CallMeItem | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/call-me");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/call-me/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchItems();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/call-me/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("已删除");
      await fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = getCallMeIcon(item.iconName);
        return (
          <div
            key={item.id}
            className="border p-4 rounded-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md border flex items-center justify-center bg-background">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">
                  {item.label} <span className="text-xs text-muted-foreground">({item.type})</span>
                </div>
                <div className="text-sm text-muted-foreground break-all">
                  {item.type === "link" ? item.href : item.value}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                variant={item.isPublished ? "default" : "outline"}
                onClick={() => togglePublish(item.id, !item.isPublished)}
              >
                {item.isPublished ? "已发布" : "未发布"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(item)}>
                编辑
              </Button>
              <Button variant="destructive" onClick={() => removeItem(item.id)}>
                删除
              </Button>
            </div>
          </div>
        );
      })}

      {items.length === 0 && <div className="text-sm text-muted-foreground">暂无数据</div>}

      {editing && (
        <EditCallMeDialog
          open={!!editing}
          onOpenChange={(open) => setEditing(open ? editing : null)}
          item={editing}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}


