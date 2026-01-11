import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getContentLanguageFromRequest, contentLanguageSchema } from "@/lib/validations/contentLanguage";

const updateCallMeSchema = z
  .object({
    language: contentLanguageSchema.optional(),
    label: z.string().min(1).optional(),
    type: z.enum(["text", "link"]).optional(),
    iconName: z.string().min(1).optional(),
    value: z.string().min(1).optional(),
    href: z.string().url().nullable().optional(),
    order: z.number().int().optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const callMeDelegate = (prisma as any).callMe;
    if (!callMeDelegate) {
      console.error("Admin CallMe API: prisma client is missing CallMe model. Restart dev server after prisma generate.");
      return NextResponse.json(
        { error: "Prisma client is outdated. Please restart the dev server." },
        { status: 500 }
      );
    }

    const language = getContentLanguageFromRequest(_request);
    const callMeItem = await callMeDelegate.findFirst({
      where: { id: params.id, language },
    });
    return NextResponse.json(callMeItem);
  } catch (error) {
    console.error("Admin CallMe API: get failed", error);
    return NextResponse.json({ error: "Failed to fetch callMe item" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const callMeDelegate = (prisma as any).callMe;
    if (!callMeDelegate) {
      console.error("Admin CallMe API: prisma client is missing CallMe model. Restart dev server after prisma generate.");
      return NextResponse.json(
        { error: "Prisma client is outdated. Please restart the dev server." },
        { status: 500 }
      );
    }

    const json = await request.json();
    const parsed = updateCallMeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const language = getContentLanguageFromRequest(request);
    const existing = await callMeDelegate.findFirst({
      where: { id: params.id, language },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const callMeItem = await callMeDelegate.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(callMeItem);
  } catch (error) {
    console.error("Admin CallMe API: update failed", error);
    return NextResponse.json({ error: "Failed to update callMe item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const callMeDelegate = (prisma as any).callMe;
    if (!callMeDelegate) {
      console.error("Admin CallMe API: prisma client is missing CallMe model. Restart dev server after prisma generate.");
      return NextResponse.json(
        { error: "Prisma client is outdated. Please restart the dev server." },
        { status: 500 }
      );
    }

    const language = getContentLanguageFromRequest(_request);
    const existing = await callMeDelegate.findFirst({
      where: { id: params.id, language },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await callMeDelegate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin CallMe API: delete failed", error);
    return NextResponse.json({ error: "Failed to delete callMe item" }, { status: 500 });
  }
}


