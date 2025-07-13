"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: "请输入您的留言",
    })
    .max(500, {
      message: "太多了太多了，塞不下了",
    })
    .trim(),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("提交失败");
      form.reset();
      toast({
        title: "感谢您的留言！",
        description: "我将尽快与您取得联系！🙏 😄",
      });
    } catch (error) {
      console.error("提交表单时发生错误:", error);
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "非常抱歉，服务器好像有一点问题，请稍后再试🙇🙇🙇",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="h-full flex flex-col"
        noValidate
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1 flex flex-col">
              <FormLabel className="text-foreground mb-2">感谢您能够留下联系方式：</FormLabel>
              <FormControl className="flex-1">
                <Textarea
                  placeholder="请输入..."
                  className="resize-none h-[calc(100%-2rem)]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center w-full">
          <Button type="submit" disabled={isSubmitting} className="mt-4 w-32">
            {isSubmitting ? "提交中..." : "提交"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 