

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const field = await prisma.customField.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(field);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update custom field" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customField.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete custom field" },
      { status: 500 }
    );
  }
} 

// 单个查询
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const field = await prisma.customField.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(field);
}