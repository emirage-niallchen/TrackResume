import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    // 优先查询 zh 语言的设置（最新的），如果没有则查询任意设置
    const [zhSettings, project] = await Promise.all([
      prisma.settings.findFirst({ 
        where: { language: "zh" },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.project.findUnique({ where: { id: params.id }, select: { name: true } }),
    ]);
    
    const settings = zhSettings ?? await prisma.settings.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    const websiteTitle = settings?.websiteTitle ?? "Resume Portfolio";
    const projectName = project?.name?.trim();

    if (!projectName) {
      return { title: websiteTitle };
    }

    return { title: `${projectName} | ${websiteTitle}` };
  } catch (error) {
    console.error("Metadata: project detail generate failed", error);
    return { title: "Resume Portfolio" };
  }
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


