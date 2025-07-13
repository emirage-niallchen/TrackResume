

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/auth";


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

    // 确保 params.id 存在
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "缺少ID" }), {
        status: 400,
      });
    }

    // 构建更新数据对象
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


    const tech= await prisma.tech.findUnique({
      where: { id }
    });

    if (!tech) {
      return new Response(JSON.stringify({ error: "技术栈不存在" }), {
        status: 404,
      });
    }

    // 删除数据库记录
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