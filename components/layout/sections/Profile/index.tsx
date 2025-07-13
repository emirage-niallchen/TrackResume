import { FC } from 'react';
import { SectionConfig } from '@/lib/types';

interface ProfileProps {
  data: any;
  config: SectionConfig;
}

const Profile: FC<ProfileProps> = ({config }) => {
  return (
    <section className={`${config.colors.text}`}>
      {/* Profile 组件内容 */}
    </section>
  );
};

export default Profile; 