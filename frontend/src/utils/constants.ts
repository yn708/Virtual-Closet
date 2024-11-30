/* ----------------------------------------------------------------
META DATA
------------------------------------------------------------------ */
export const SITE_NAME = 'Virtual Closet';
export const DESCRIPTION =
  'Virtual Closetは、日々のコーディネートを手助けするWebアプリケーションです。';
export const SITE_URL = 'localhost:4000';

/* ----------------------------------------------------------------
size
------------------------------------------------------------------ */
export const ICON_SIZE = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const AVATAR_ICON_SIZE = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
};

/* ----------------------------------------------------------------
バリデーション
------------------------------------------------------------------ */
export const MIN_PASSWORD_LENGTH = 8;
export const MIN_USERNAME_LENGTH = 2;
export const AUTH_CODE_LENGTH = 6;

/* ----------------------------------------------------------------
API_ENDPOINT
------------------------------------------------------------------ */
// ベース
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_AUTH_ENDPOINT = '/api/auth';
export const BASE_LOGIN_ENDPOINT = `${BASE_AUTH_ENDPOINT}/login`;
export const BASE_SIGNUP_ENDPOINT = `${BASE_AUTH_ENDPOINT}/verification`;
export const BASE_USER_ENDPOINT = `${BASE_AUTH_ENDPOINT}/user`;

// 認証系
export const LOGIN_GOOGLE_ENDPOINT = `${BASE_LOGIN_ENDPOINT}/google/`;
export const LOGIN_EMAIL_ENDPOINT = `${BASE_LOGIN_ENDPOINT}/email/`;
export const LOGIN_AFTER_VERIFICATION_ENDPOINT = `${BASE_LOGIN_ENDPOINT}/after-verification/`;
export const SEND_AUTH_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}/send/`;
export const RESEND_AUTH_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}/resend/`;
export const VERIFY_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}/verify/`;
export const SEND_PASSWORD_RESET_ENDPOINT = `${BASE_AUTH_ENDPOINT}/password/reset/`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${BASE_AUTH_ENDPOINT}/password/reset/confirm/`;
export const TOKEN_REFRESH_ENDPOINT = `${BASE_AUTH_ENDPOINT}/token-refresh/`;
// User関連（情報、更新等）
export const BASE_USER_DETAIL_ENDPOINT = `${BASE_USER_ENDPOINT}/detail/`;
export const BASE_USER_UPDATE_ENDPOINT = `${BASE_USER_ENDPOINT}/update/`;

// 画像
export const IMAGE_REMOVE_BG_ENDPOINT = `/api/image/remove-bg/`;

/* ----------------------------------------------------------------
URL
------------------------------------------------------------------ */
// バックエンド
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// トップ
export const TOP_URL = '/top';
export const APP_ABOUT_URL = '/';

// 認証系
export const LOGIN_URL = '/auth/login';
export const LOGIN_ERROR_URL = '/auth/login/error';
export const SIGN_UP_URL = '/auth/sign-up';
export const CONFIRM_CODE_URL = '/auth/confirm';
export const PASSWORD_RESET_URL = '/auth/password/reset';

// コンタクト
export const CONTACT_URL = '/contact';
// マイページ
export const MY_PAGE_URL = '/my-page';
// ファッションアイテム
export const ITEM_EDIT_URL = '/outfit/item/edit';
// コーディネート作成
export const COORDINATE_EDIT_URL = '/outfit/coordinate/edit';
export const COORDINATE_CREATE_CANVAS_URL = '/outfit/coordinate/canvas';

/* ----------------------------------------------------------------
ERROR MESSAGE
------------------------------------------------------------------ */
export const ERROR_MESSAGE = '何らかの問題が発生しました';
export const ERROR_DESCRIPTION_MESSAGE = '時間をおいてから再度お試しください。';

/* ----------------------------------------------------------------
image
------------------------------------------------------------------ */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/heic'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.heic'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const DEFAULT_USER_IMAGE = '/images/default.png';
