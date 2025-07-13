import { FC } from 'react';
import { SectionConfig } from '@/lib/types';

interface CustomFieldsProps {
  data: any;
  config: SectionConfig;
}

const CustomFields: FC<CustomFieldsProps> = ({ data, config }) => {
  return (
    <section className={`${config.colors.text}`}>
      {/* CustomFields 组件内容 */}
    </section>
  );
};

export default CustomFields; 