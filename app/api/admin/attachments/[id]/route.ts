

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAuth } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

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
    const { name, isPublished, tags } = data;

    // 确保 params.id 存在
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "缺少文件ID" }), {
        status: 400,
      });
    }

    // 更新文件信息
    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        name,
        isPublished,
        tags: {
          deleteMany: {},
          create: tags.map((tagId: string) => ({
            tag: {
              connect: { id: tagId }
            }
          }))
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return new Response(JSON.stringify(updatedFile), {
      status: 200,
    });
  } catch (error) {
    console.error("更新文件失败:", error);
    return new Response(
      JSON.stringify({ error: "更新文件失败" }), 
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
      return new Response(JSON.stringify({ error: "缺少文件ID" }), {
        status: 400,
      });
    }

    // 先获取文件信息
    const file = await prisma.file.findUnique({
      where: { id }
    });

    if (!file) {
      return new Response(JSON.stringify({ error: "文件不存在" }), {
        status: 404,
      });
    }

    // 删除物理文件
    const filepath = path.join(process.cwd(), "public", file.path);
    try {
      await unlink(filepath);
    } catch (error) {
      console.error("物理文件删除失败:", error);
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 删除数据库记录
    await prisma.file.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("删除文件失败:", error);
    return new Response(
      JSON.stringify({ error: "删除文件失败" }), 
      { status: 500 }
    );
  }
} 