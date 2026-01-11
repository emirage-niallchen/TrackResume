import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const language = getContentLanguageFromRequest(request);
    const callMeDelegate = (prisma as any).callMe;
    if (!callMeDelegate) {
      console.error("CallMe API: prisma client is missing CallMe model. Restart dev server after prisma generate.");
      return NextResponse.json(
        { error: "Prisma client is outdated. Please restart the dev server." },
        { status: 500 }
      );
    }

    const callMeItems = await callMeDelegate.findMany({
      where: { isPublished: true, language },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(callMeItems);
  } catch (error) {
    console.error("CallMe API: fetch failed", error);
    return NextResponse.json({ error: "Failed to fetch callMe items" }, { status: 500 });
  }
}


