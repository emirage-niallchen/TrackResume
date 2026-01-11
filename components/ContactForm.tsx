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
import { useTranslation } from "react-i18next";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const formSchema = z.object({
    description: z
      .string()
      .min(1, {
        message: t("home.contact.form.validation.required"),
      })
      .max(500, {
        message: t("home.contact.form.validation.tooLong"),
      })
      .trim(),
  });

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
      if (!res.ok) throw new Error("Contact submit failed");
      form.reset();
      toast({
        title: t("home.contact.form.toast.success.title"),
        description: t("home.contact.form.toast.success.description"),
      });
    } catch (error) {
      console.error("Contact form submit failed:", error);
      toast({
        variant: "destructive",
        title: t("home.contact.form.toast.error.title"),
        description: t("home.contact.form.toast.error.description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        key={i18n.resolvedLanguage}
        onSubmit={form.handleSubmit(onSubmit)} 
        className="h-full flex flex-col"
        noValidate
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1 flex flex-col">
              <FormLabel className="text-foreground mb-2">
                {t("home.contact.form.label")}
              </FormLabel>
              <FormControl className="flex-1">
                <Textarea
                  placeholder={t("home.contact.form.placeholder")}
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
            {isSubmitting
              ? t("home.contact.form.submitting")
              : t("home.contact.form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
} 