import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Favicon file is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file" },
        { status: 400 }
      );
    }

    // Get existing settings
    let settings = await prisma.settings.findFirst();
    
    // If favicon exists, delete old file from S3
    if (settings?.favicon) {
      try {
        await deleteFromS3(settings.favicon);
      } catch (error) {
        console.error("Failed to delete old favicon:", error);
        // Continue with upload, don't fail if delete fails
      }
    }

    // Upload file to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUrl = await uploadToS3(buffer, file.name, file.type, 'settings/favicon');

    // Update or create settings
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { favicon: fileUrl },
      });
    } else {
      settings = await prisma.settings.create({
        data: {
          websiteTitle: 'Resume Portfolio',
          favicon: fileUrl,
        },
      });
    }

    return NextResponse.json({ favicon: settings.favicon });
    
  } catch (error) {
    console.error("Favicon upload failed:", error);
    return NextResponse.json(
      { error: "Favicon upload failed" },
      { status: 500 }
    );
  }
}

