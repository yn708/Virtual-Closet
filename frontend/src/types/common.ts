import type { ReactNode } from 'react';
/* ----------------------------------------------------------------
よく使用される共通のタイプ（最小限）
------------------------------------------------------------------ */
export interface ChildrenType {
  children: React.ReactNode;
}

export interface ClassNameType {
  className?: string;
}

export interface LabelType {
  label?: string;
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
  loading?: boolean;
}

export interface SizeType {
  size?: 'sm' | 'md' | 'lg';
}

export interface IdType {
  id: string;
}

/* ----------------------------------------------------------------
関数
------------------------------------------------------------------ */
// 成功時に何か行う場合がある時の型
export interface OnSuccessType {
  onSuccess?: () => void;
}

// 何か行う場合がある時の型（クリック時等）
export interface OnClickType {
  onClick?: () => void;
}

/* ----------------------------------------------------------------
カウントAPI
------------------------------------------------------------------ */
// 登録済みアイテムのカウントと残りの登録可能数
export interface CountDataType {
  current_count: number;
  max_items: number;
}

export interface CountData {
  countData: CountDataType;
}
