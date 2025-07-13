import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomFieldItem from "./CustomFieldItem";

// 定义表单数据验证模式
const profileSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  title: z.string().min(1, "职位不能为空"),
  summary: z.string(),
  customFields: z.array(z.object({
    label: z.string(),
    value: z.string(),
    type: z.enum(["text", "link"])
  }))
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData || {
      name: "",
      title: "",
      summary: "",
      customFields: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customFields"
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="w-4/5 mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="姓名"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="职位"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="个人简介"
            {...form.register("summary")}
          />
        </div>
      </div>

      {/* 自定义字段部分 */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Button
            type="button"
            onClick={() => append({ label: "", value: "", type: "text" })}
            className="mb-4"
          >
            添加自定义字段
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <CustomFieldItem
            key={field.id}
            index={index}
            form={form}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-center pt-6">
        <Button type="submit" className="w-1/3">
          保存更改
        </Button>
      </div>
    </form>
  );
} 