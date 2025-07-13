import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus } from "lucide-react";

interface CustomFieldItemProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
}

export default function CustomFieldItem({ index, form, onRemove }: CustomFieldItemProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1 grid grid-cols-[1fr_3fr_1fr] gap-4">
        <Input
          placeholder="字段名称"
          className="w-full"
          {...form.register(`customFields.${index}.label`)}
        />
        <Input
          placeholder="字段值"
          className="w-full"
          {...form.register(`customFields.${index}.value`)}
        />
        <Select
          defaultValue={form.getValues(`customFields.${index}.type`) || "text"}
          onValueChange={(value) =>
            form.setValue(`customFields.${index}.type`, value, {
              shouldValidate: true
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">文本</SelectItem>
            <SelectItem value="link">链接</SelectItem>
            <SelectItem value="card">卡片</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onRemove}
        className="shrink-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
} 