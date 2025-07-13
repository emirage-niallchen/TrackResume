"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { TagSchema, TagFormValues } from "@/lib/validations/tag"
import { Tag } from "@/lib/types"

interface TagFormProps {
  onSubmit: (values: TagFormValues) => void
  defaultValues?: Tag
}

export function TagForm({ onSubmit, defaultValues }: TagFormProps) {
  const [loading, setLoading] = useState(false)
  const form = useForm<TagFormValues>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      color: defaultValues?.color || "#000000",
      order: defaultValues?.order || 0,
      isPublished: defaultValues?.isPublished || false,
    },
  })

  const handleSubmit = async (values: TagFormValues) => {
    try {
      setLoading(true)
      const url = "/api/tags"
      const method = defaultValues ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          id: defaultValues?.id,
        }),
      })

      if (!res.ok) {
        throw new Error("提交失败")
      }

      onSubmit(values)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签名称</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>颜色</FormLabel>
              <FormControl>
                <Input type="color" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : "确定"}
        </Button>
      </form>
    </Form>
  )
} 