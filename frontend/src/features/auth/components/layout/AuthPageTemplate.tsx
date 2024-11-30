import ImageAndContentSplitLayout from '@/components/layout/ImageAndContentSplitLayout';
import TitleLayout from '@/components/layout/TitleLayout';
import type { AuthPageTemplateProps } from '../../types';

const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  title,
  description,
  subDescription,
  children,
  isReversed,
}) => {
  return (
    <ImageAndContentSplitLayout
      isReversed={isReversed}
      leftContent={
        <TitleLayout
          title={title}
          description={description}
          subDescription={subDescription}
          className="text-center"
        >
          <div className="space-y-5 mx-auto max-w-md">{children}</div>
        </TitleLayout>
      }
      rightContent={
        <div className="text-center py-10">
          <h2 className="2xl:text-8xl md:text-7xl text-5xl font-extrabold tracking-wide space-y-6">
            <p>Virtual</p>
            <p>Closet</p>
          </h2>
        </div>
      }
    />
  );
};

export default AuthPageTemplate;
