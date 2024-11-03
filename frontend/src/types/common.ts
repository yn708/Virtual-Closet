/* ----------------------------------------------------------------
よく使用される共通のタイプ（最小限）
------------------------------------------------------------------ */

import type { ReactNode } from 'react';

export interface ChildrenType {
  children: React.ReactNode;
}

export interface ClassNameType {
  className?: string;
}

export interface LabelType {
  label: string;
}

export interface TextType {
  text: string;
}

export interface TitleType {
  title: string;
}
export interface DescriptionType {
  description: string;
}

// 必要な場合に
export interface SubDescriptionType {
  subDescription?: string | ReactNode;
}

export interface LoadingType {
  loading: boolean;
}

/* ----------------------------------------------------------------
関数
------------------------------------------------------------------ */
// 成功時に何か行う場合がある時の型
export interface OnSuccessType {
  onSuccess?: () => void;
}
