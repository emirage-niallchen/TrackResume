import { FC } from 'react';
import { SectionConfig } from '@/lib/types';

interface TechsProps {
  data: any;
  config: SectionConfig;
}

const Techs: FC<TechsProps> = ({config }) => {
  return (
    <section className={`${config.colors.text}`}>
      {/* Techs 组件内容 */}
    </section>
  );
};

export default Techs; 