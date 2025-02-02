import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import { useToast } from '@/hooks/use-toast';
import {
  customCoordinateCreateAction,
  customCoordinateUpdateAction,
} from '@/lib/actions/outfit/customCoordinateAction';
import type { FormState, FormStateCoordinateUpdate } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { initialState } from '@/utils/data/initialState';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import type { CoordinateEditTypes } from '../types';
import { TOP_URL } from '@/utils/constants';

export const useCustomCoordinateForm = ({
  initialItems,
  initialData,
  onSuccess,
}: InitialItemsProps & CoordinateEditTypes) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleFormAction = async (
    prevState: FormState | FormStateCoordinateUpdate,
    formData: FormData,
  ) => {
    if (initialData) {
      return handleUpdateAction(prevState as FormStateCoordinateUpdate, formData, initialData);
    }
    return handleCreateAction(prevState as FormState, formData);
  };

  // アイテム編集用アクション
  const handleUpdateAction = async (
    prevState: FormStateCoordinateUpdate,
    formData: FormData,
    initialData: BaseCoordinate,
  ) => {
    const result = await customCoordinateUpdateAction(
      prevState,
      formData,
      initialData,
      initialItems,
    );

    if (result.success && result.hasChanges) {
      onSuccess?.(result.updatedItem as BaseCoordinate);
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
    const result = await customCoordinateCreateAction(prevState, formData);
    if (result.success) {
      router.push(TOP_URL);
    }
    if (!result.success && result.message) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: result.message,
        duration: 3000,
      });
    }
    return result;
  };

  const [state, formAction] = useFormState(handleFormAction, initialState);

  return {
    state,
    formAction,
  };
};
