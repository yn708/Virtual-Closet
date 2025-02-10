import ImageAndContentSplitLayout from '@/components/layout/ImageAndContentSplitLayout';
import TitleLayout from '@/components/layout/TitleLayout';
import Footer from '@/features/navItems/components/layout/Footer';
import type { AuthPageTemplateProps } from '../../types';

const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({
  title,
  description,
  subDescription,
  children,
  isReversed,
}) => {
  return (
    <>
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
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-wider drop-shadow-2xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">
                V
              </span>
              IRTUAL
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-600">
                C
              </span>
              LOSET
            </h1>
          </div>
        }
      />
      <Footer className="relative" />
    </>
  );
};

export default AuthPageTemplate;
