import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BaseButtonProps, LabelType, LoadingType } from '@/types';
import { useFormStatus } from 'react-dom';
import SubmitLoading from '../loading/SubmitLoading';

const SubmitButton: React.FC<LoadingType & LabelType & BaseButtonProps> = ({
  loading = false,
  label = '送信',
  disabled,
  className,
  type = 'submit',
  ...props
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type={type}
      disabled={disabled || loading || pending}
      className={cn(
        `
        w-full rounded-lg py-5 border border-blue-500 font-semibold 
        transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600
        ${loading ? 'relative' : ''}
      `,
        className,
      )}
      {...props}
    >
      {loading || pending ? (
        <>
          <SubmitLoading />
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default SubmitButton;
