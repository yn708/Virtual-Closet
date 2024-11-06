import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { LegalDocument } from '@/features/auth/types';
import type { ClassNameType, LabelType } from '@/types';

interface LegalDialogProps extends LabelType, ClassNameType {
  data: LegalDocument;
}

export function LegalDialog({
  data,
  label,
  className = 'p-0 h-auto font-medium text-blue-500 hover:text-blue-700 hover:underline',
}: LegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="link" className={className}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10 md:max-w-[90vw] md:max-h-[90vh] h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto text-slate-700">
          <DialogHeader className="space-y-3 mb-8">
            <DialogTitle className="text-2xl text-center">{data.title}</DialogTitle>
            <DialogDescription className="max-w-4xl mx-auto">{data.description} </DialogDescription>
          </DialogHeader>

          {data.sections.map((section, index) => (
            <div className="mb-10" key={index}>
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
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
