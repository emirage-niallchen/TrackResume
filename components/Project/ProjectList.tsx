import { FC } from 'react';
import ProjectCard from '@/components/Project/ProjectCard';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  duration?: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="grid gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList; 