import * as z from "zod"

export const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "标签名称不能为空"),
  description: z.string().optional(),
  color: z.string(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
})

export type TagFormValues = z.infer<typeof TagSchema> 