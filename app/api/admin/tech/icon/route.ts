import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/utils/s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Icon file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload JPG, PNG or SVG format image" },
        { status: 400 }
      );
    }

    // Validate file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size cannot exceed 10MB" },
        { status: 400 }
      );
    }

    // Upload file to S3
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUrl = await uploadToS3(buffer, file.name, file.type, 'tech/icons');

    return NextResponse.json({ iconUrl: fileUrl });
    
  } catch (error) {
    console.error("Tech icon upload failed:", error);
    return NextResponse.json(
      { error: "Tech icon upload failed" },
      { status: 500 }
    );
  }
}

