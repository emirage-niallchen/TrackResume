

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/auth";
import { deleteFromS3 } from "@/lib/utils/s3";
import { getContentLanguageFromRequest } from "@/lib/validations/contentLanguage";


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户权限
    const authResult = await checkAuth();
    if (!authResult.authorized) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
      });
    }

    const data = await request.json();
    const { name, description, bgColor, isPublished, tags, icon } = data;

    // Ensure params.id exists.
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "缺少ID" }), {
        status: 400,
      });
    }

    // Get existing tech to check for old icon
    const language = getContentLanguageFromRequest(request);
    const existingTech = await prisma.tech.findFirst({
      where: { id, language },
    });
    if (!existingTech) {
      return new Response(JSON.stringify({ error: "技术栈不存在" }), { status: 404 });
    }
    
    // If icon is being updated and old icon exists, delete it from S3
    if (icon !== undefined && icon !== null && existingTech?.icon) {
      // Only delete if old icon is an S3 URL (not base64)
      if (existingTech.icon.startsWith('http://') || existingTech.icon.startsWith('https://')) {
        try {
          await deleteFromS3(existingTech.icon);
        } catch (error) {
          console.error('Failed to delete old tech icon:', error);
          // Continue with update, don't fail if delete fails
        }
      }
    }

    // Build update data object
    const updateData: any = {
      ...(name && { name }),
      ...(description && { description }),
      ...(bgColor && { bgColor }),
      ...(typeof isPublished === 'boolean' && { isPublished }),
      ...(icon !== undefined && { icon })
    };

    // 如果提供了tags，添加tags更新
    if (Array.isArray(tags)) {
      updateData.tags = {
        deleteMany: {},
        create: tags.map((tagId: string) => ({
          tag: {
            connect: { id: tagId }
          }
        }))
      };
    }

    const updatedTech = await prisma.tech.update({
      where: { id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return new Response(JSON.stringify(updatedTech), {
      status: 200,
    });
  } catch (error) {
    console.error("更新技术栈失败:", error);
    return new Response(
      JSON.stringify({ error: "更新技术栈失败" }), 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户权限
    const authResult = await checkAuth();
    if (!authResult.authorized) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
      });
    }

    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "缺少ID" }), {
        status: 400,
      });
    }

    const language = getContentLanguageFromRequest(request);
    const tech = await prisma.tech.findFirst({
      where: { id, language }
    });

    if (!tech) {
      return new Response(JSON.stringify({ error: "技术栈不存在" }), {
        status: 404,
      });
    }

    // Delete icon from S3 if it exists and is an S3 URL
    if (tech.icon && (tech.icon.startsWith('http://') || tech.icon.startsWith('https://'))) {
      try {
        await deleteFromS3(tech.icon);
      } catch (error) {
        console.error('Failed to delete tech icon from S3:', error);
        // Continue with deletion, don't fail if S3 delete fails
      }
    }

    // Delete database record
    await prisma.tech.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("删除技术栈失败:", error);
    return new Response(
      JSON.stringify({ error: "删除文件失败" }), 
      { status: 500 }
    );
  }
} 