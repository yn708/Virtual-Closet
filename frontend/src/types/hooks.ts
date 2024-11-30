/* ----------------------------------------------------------------
useImage
------------------------------------------------------------------ */
export interface UseImageType {
  image: File | null;
  minimumImageSet: (file: File) => void;
  optimizationProcess: (file: File) => void;
  removeBgProcess: (file: File) => void;
  preview: string | null;
  isProcessing: boolean;
  clearImage: () => void;
}

/* ----------------------------------------------------------------
useIsOpen
------------------------------------------------------------------ */
export interface UseIsOpenOnCloseType {
  onClose: () => void;
}
