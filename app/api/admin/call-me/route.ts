import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createCallMeSchema = z.object({
  label: z.string().min(1),
  type: z.enum(["text", "link"]),
  iconName: z.string().min(1),
  value: z.string().min(1),
  href: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const callMeDelegate = (prisma as any).callMe;
    if (!callMeDelegate) {
      console.error("Admin CallMe API: prisma client is missing CallMe model. Restart dev server after prisma generate.");
      return NextResponse.json(
        { error: "Prisma client is outdated. Please restart the dev server." },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const label = searchParams.get("label") || undefined;

    const callMeItems = await callMeDelegate.findMany({
      where: {
        ...(label ? { label: { contains: label } } : {}),
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(callMeItems);
  } catch (error) {
    console.error("Admin CallMe API: list failed", error);
    return NextResponse.json({ error: "Failed to list callMe items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const parsed = createCallMeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const maxOrderItem = await callMeDelegate.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = maxOrderItem ? maxOrderItem.order + 1 : 0;

    const callMeItem = await callMeDelegate.create({
      data: {
        ...parsed.data,
        order: newOrder,
        isPublished: false,
      },
    });

    return NextResponse.json(callMeItem);
  } catch (error) {
    console.error("Admin CallMe API: create failed", error);
    return NextResponse.json({ error: "Failed to create callMe item" }, { status: 500 });
  }
}


