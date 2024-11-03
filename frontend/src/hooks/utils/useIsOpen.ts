/*
Dialog, Sheet等の開閉を制御するためのカスタムフック
*/
'use client';
import { useCallback, useState } from 'react';

export const useIsOpen = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onClose, onToggle };
};

// 使用例
// const { isOpen, onClose, onToggle } = useIsOpen();
