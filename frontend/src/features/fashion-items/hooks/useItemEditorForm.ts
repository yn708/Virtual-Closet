import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import {
  fashionItemsCreateAction,
  fashionItemsUpdateAction,
} from '@/lib/actions/outfit/fashionItemsAction';
import type { FashionItem, FormState, FormStateFashionItemUpdate } from '@/types';
import { TOP_URL } from '@/utils/constants';
import { initialState } from '@/utils/data/initialState';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import type { UseItemEditorFormProps } from '../types';

export const useItemEditorForm = ({ initialData, onSuccess }: UseItemEditorFormProps) => {
  const { toast } = useToast();
  const { isProcessing, preview, clearImage } = useImage();
  const router = useRouter();

  const handleFormAction = async (
    prevState: FormState | FormStateFashionItemUpdate,
    formData: FormData,
  ) => {
    if (initialData) {
      return handleUpdateAction(prevState as FormStateFashionItemUpdate, formData, initialData);
    }
    return handleCreateAction(prevState as FormState, formData);
  };

  // アイテム編集用アクション
  const handleUpdateAction = async (
    prevState: FormStateFashionItemUpdate,
    formData: FormData,
    initialData: FashionItem,
  ) => {
    const result = await fashionItemsUpdateAction(prevState, formData, initialData);

    if (result.success && result.hasChanges) {
      clearImage();
      onSuccess?.(result.updatedItem as FashionItem);
    } else if (!result.hasChanges && !result.errors) {
      toast({
        title: result.message as string,
        duration: 3000,
      });
    }

    return result;
  };

  // アイテム作成用アクション
  const handleCreateAction = async (prevState: FormState, formData: FormData) => {
    const result = await fashionItemsCreateAction(prevState, formData);

    if (result.success) {
      clearImage();
      router.push(TOP_URL);
    }
    return result;
  };

  const [state, formAction] = useFormState(handleFormAction, initialState);

  return {
    state,
    formAction,
    isProcessing,
    preview,
  };
};
