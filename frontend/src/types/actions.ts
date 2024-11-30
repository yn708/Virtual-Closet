/* ----------------------------------------------------------------
Server actions
------------------------------------------------------------------ */
// 基盤
export interface FormState {
  message: string | null; // 操作結果のメッセージ
  errors: Record<string, string[]> | null; // 各フィールドに関連付けられたエラーメッセージ
  success?: boolean; // 成功状態を追加
}

export interface LoginFormState extends FormState {
  email?: string;
  password?: string;
}

export interface FormStateWithToken extends FormState {
  token?: string; // 認証トークンを保持するためのフィールド
}

export interface FormStateWithEmail extends FormState {
  email?: string;
}

export interface FormStateWithChange extends FormState {
  hasChanges?: boolean;
}
