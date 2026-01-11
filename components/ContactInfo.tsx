"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher, getCallMeIcon } from "@/lib/utils";

interface CallMeItem {
  id: string;
  label: string;
  type: "text" | "link";
  iconName: string;
  value: string;
  href?: string | null;
}

export function ContactInfo() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { data: callMeItems, isLoading } = useSWR<CallMeItem[]>("/api/call-me", fetcher);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("复制成功！");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("复制失败，请手动复制");
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">加载中...</div>
        </CardContent>
      </Card>
    );
  }

  const items = callMeItems || [];

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="grid gap-4">
          {items.map((item, index) => {
            const Icon = getCallMeIcon(item.iconName);
            const copyText = item.type === "link" ? (item.href || item.value) : item.value;
            return (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div 
                className="flex items-center gap-2 cursor-pointer flex-1"
                onClick={() => handleCopy(copyText, index)}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}:</span>
                {item.type === "link" && item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground transition-colors underline break-all ${copiedIndex === index ? "text-green-500" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className={`text-muted-foreground transition-colors ${copiedIndex === index ? 'text-green-500' : ''}`}>
                    {item.value}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(copyText, index)}
                className="ml-2"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )})}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">暂无联系方式</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 