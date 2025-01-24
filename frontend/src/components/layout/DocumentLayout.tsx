import type { LegalDocument } from '@/features/auth/types';
import type { FC } from 'react';

interface Props {
  data: LegalDocument;
}

const DocumentLayout: FC<Props> = ({ data }) => {
  return (
    <main className="max-w-4xl mx-auto p-10 md:p-20">
      <div className="text-gray-700">
        <div className="space-y-3 mb-8">
          <h1 className="font-extrabold text-2xl text-center">{data.title}</h1>
          <p className="text-sm">{data.description}</p>
        </div>

        {data.sections.map((section, index) => (
          <section className="mb-10" key={index}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {Array.isArray(section.content) ? (
              <ol className="text-sm list-decimal list-inside grid gap-2 pl-4">
                {section.content.map((item, index) => (
                  <li key={index}>
                    {item.text}
                    {item.subItems && (
                      <ul className="list-disc list-inside ml-6 mt-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>{subItem}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm">{section.content}</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};

export default DocumentLayout;
