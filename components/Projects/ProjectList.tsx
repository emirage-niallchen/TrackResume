'use client';

import { useProjects } from '@/lib/hooks/useProjects';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ProjectList() {
  const { projects, loading, error, fetchProjects, deleteProject } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.description}</p>
            {/* <div className="flex gap-2 mt-2">
              {project.images.length > 0 && (
                <span className="text-xs text-gray-500">
                  {project.images.length} images
                </span>
              )}
              {project.links.length > 0 && (
                <span className="text-xs text-gray-500">
                  {project.links.length} links
                </span>
              )}
            </div> */}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/projects/${project.id}`}
              className="text-blue-500 hover:text-blue-600"
            >
              编辑
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('确定要删除这个项目吗？')) {
                  deleteProject(project.id);
                }
              }}
              className="text-red-500 hover:text-red-600"
            >
              删除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 