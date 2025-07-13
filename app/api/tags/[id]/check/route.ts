

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tagId = params.id
    
    // 同时检查所有可能的关联
    const [fileTags, techTags, projectTags] = await Promise.all([
      prisma.fileTag.findMany({
        where: { tagId },
        include: { file: true }
      }),
      prisma.techTag.findMany({
        where: { tagId },
        include: { tech: true }
      }),
      prisma.projectTag.findMany({
        where: { tagId },
        include: { project: true }
      })
    ])

    const associations = {
      files: fileTags.map(ft => ({ id: ft.file.id, name: ft.file.name })),
      techs: techTags.map(tt => ({ id: tt.tech.id, name: tt.tech.name })),
      projects: projectTags.map(pt => ({ id: pt.project.id, name: pt.project.name }))
    }

    const hasAssociations = fileTags.length > 0 || techTags.length > 0 || projectTags.length > 0

    return NextResponse.json({ hasAssociations, associations })
  } catch (error) {
    return NextResponse.json(
      { error: "检查标签关联失败" },
      { status: 500 }
    )
  }
} 