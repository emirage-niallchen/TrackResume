import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Mail, Phone, Github, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const contactItems: ContactItem[] = [
  {
    icon: <Mail className="h-4 w-4" />,
    label: "邮箱",
    value: "admin@artithm.com"
  },
  {
    icon: <Phone className="h-4 w-4" />,
    label: "电话",
    value: "+86 1563063XXXX"
  },
  {
    icon: <Github className="h-4 w-4" />,
    label: "GitHub",
    value: "https://github.com/emirage-niallchen"
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    label: "微信",
    value: "XXXX_XX_XXX"
  }
];

export function ContactInfo() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      toast.success("复制成功！");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      toast.error("复制失败，请手动复制");
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="grid gap-4">
          {contactItems.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div 
                className="flex items-center gap-2 cursor-pointer flex-1"
                onClick={() => handleCopy(item.value, index)}
              >
                {item.icon}
                <span className="font-medium">{item.label}:</span>
                <span className={`text-muted-foreground transition-colors ${copiedIndex === index ? 'text-green-500' : ''}`}>
                  {item.value}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(item.value, index)}
                className="ml-2"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 