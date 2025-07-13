import { formatResumeDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Upload, FileText } from "lucide-react";
import { Project } from "@prisma/client";
import { ProjectVO } from "@/app/api/projects/route";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: ProjectVO[];
  onEdit?: (project: ProjectVO) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const router = useRouter();

  if (!projects?.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        暂无项目数据
      </div>
    );
  }

  const handleUpload = (projectId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", projectId);
      try {
        const res = await fetch("/api/admin/projects/uploadDetail", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("文件上传成功");
        } else {
          toast.error(data.error || "上传失败");
        }
      } catch (error) {
        toast.error("上传失败");
      }
    };
    input.click();
  };

  const handleViewDetail = (projectId: string) => {
    window.open(`/projects/${projectId}/detail`, '_blank');
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col h-full">
          {/* 图片始终在顶部，无图片时占位，内容始终在底部 */}
          {project.images[0] ? (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={project.images[0].path}
                alt={project.images[0].alt || project.name}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center text-muted-foreground text-sm select-none">
              无图片
            </div>
          )}
          <CardHeader className="flex-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewDetail(project.id)}
                  aria-label="查看详情"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(project)}
                  aria-label="编辑"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUpload(project.id)}
                  aria-label="上传详情文件"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(project.id)}
                  aria-label="删除">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            {project.jobRole && (
              <div className="text-sm text-muted-foreground">
                角色：{project.jobRole}
              </div>
            )}
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="space-y-4">
              <div className="text-sm">
                {project.startTime?formatResumeDate(new Date(project.startTime)):"未知"} - 
                {project.endTime ? formatResumeDate(new Date(project.endTime)) : "至今"}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.map(({ tag }) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: tag.color
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 