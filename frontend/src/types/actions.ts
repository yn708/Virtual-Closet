/* ----------------------------------------------------------------
Server actions
------------------------------------------------------------------ */

import type { BaseCoordinate } from './coordinate';
import type { FashionItem } from './fashion-item';

// Base
export interface FormState {
  message: string | null; // 操作結果のメッセージ
  errors: Record<string, string[]> | null; // 各フィールドに関連付けられたエラーメッセージ
  success?: boolean; // 成功状態を追加
}

// ログイン時
export interface LoginFormState extends FormState {
  email?: string;
  password?: string;
}

// 認証トークン
export interface FormStateWithToken extends FormState {
  token?: string; // 認証トークンを保持するためのフィールド
}

// Email
export interface FormStateWithEmail extends FormState {
  email?: string;
}

// 変更があるかどうか必要なとき
export interface FormStateWithChange extends FormState {
  hasChanges?: boolean;
}

// ファッションアイテムアップデート時
export interface FormStateFashionItemUpdate extends FormStateWithChange {
  updatedItem?: FashionItem;
}

// コーディネートアップデート時
export interface FormStateCoordinateUpdate extends FormStateWithChange {
  updatedItem?: BaseCoordinate;
}
