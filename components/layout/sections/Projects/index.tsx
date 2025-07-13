import { FC } from 'react';
import { SectionConfig } from '@/lib/types';

interface ProjectsProps {
  data: any;
  config: SectionConfig;
}

const Projects: FC<ProjectsProps> = ({ config }) => {
  return (
    <section className={`${config.colors.text}`}>
      {/* Projects 组件内容 */}
    </section>
  );
};

export default Projects; 