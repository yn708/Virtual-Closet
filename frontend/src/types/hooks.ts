/* ----------------------------------------------------------------
useImage
------------------------------------------------------------------ */
export interface UseImageType {
  image: File | null;
  setImage: (file: File | null) => void;
  preview: string | null;
  clearImage: () => void;
  isProcessing: boolean;
}

/* ----------------------------------------------------------------
useIsOpen
------------------------------------------------------------------ */
export interface UseIsOpenOnCloseType {
  onClose: () => void;
}
