import { FC } from 'react';
import { Project } from '@/components/Project/ProjectList';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
      {project.duration && (
        <p className="text-sm text-gray-500 mb-2">{project.duration}</p>
      )}
      <p className="text-gray-700 mb-3">{project.description}</p>
      {project.technologies && (
        <div className="flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <span key={tech} className="px-2 py-1 bg-gray-100 text-sm rounded-md">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCard; 