import type { FormState, UserType } from '@/types';

/*--------------------------------------------------------
ProfileImageActionsProps
--------------------------------------------------------*/
export interface ProfileImageActionsProps {
  onDeleteImage: () => void;
  hasImage: boolean;
  hasPreview: boolean;
}

/*--------------------------------------------------------
BirthDate
--------------------------------------------------------*/
export interface BirthDateState {
  year?: string;
  month?: string;
  day?: string;
}

/*--------------------------------------------------------
hooks
--------------------------------------------------------*/
export interface UseProfileImageProps {
  profileImage?: string;
  onDelete?: () => void;
}

export interface UseImageCropProps {
  image: string;
  onCropComplete: (file: File) => void;
  onClose: () => void;
  cropShape?: 'rect' | 'round';
}

/*--------------------------------------------------------
form
--------------------------------------------------------*/
export interface ProfileFieldsProps {
  state: FormState;
  userDetail: Partial<UserType>;
  onImageDelete: () => void;
  onBirthDateDelete: () => void;
}

export interface ProfileImageFieldProps {
  state: FormState;
  profileImage?: UserType['profile_image'];
  onDelete?: () => void;
  onChange?: (file: File | null) => void;
}

export interface BirthDateFieldsProps {
  state: FormState;
  onDelete?: () => void;
  defaultBirthDate?: string;
}

/*--------------------------------------------------------
ImageCropDialog
--------------------------------------------------------*/
export interface ImageCropDialogProps {
  open: boolean; // ダイアログが開いているかどうかを示す
  onToggle: (prev: boolean) => void;
  onClose: () => void; // ダイアログを閉じるための関数
  image: string; // クロップする画像のURL
  onCropComplete: (image: File) => void; // クロップ完了後に呼ばれるコールバック
  aspect?: number; // アスペクト比指定
  cropShape?: 'rect' | 'round'; // 形指定
}

export interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}
