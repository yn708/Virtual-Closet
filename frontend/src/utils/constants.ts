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
  sm_2: 'w-5 h-5',
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
// バックエンド
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 認証系
export const BASE_AUTH_ENDPOINT = '/api/auth/';
export const BASE_LOGIN_ENDPOINT = `${BASE_AUTH_ENDPOINT}login/`;
export const BASE_SIGNUP_ENDPOINT = `${BASE_AUTH_ENDPOINT}verification/`;

export const LOGIN_GOOGLE_ENDPOINT = `${BASE_LOGIN_ENDPOINT}google/`;
export const LOGIN_EMAIL_ENDPOINT = `${BASE_LOGIN_ENDPOINT}email/`;
export const LOGIN_AFTER_VERIFICATION_ENDPOINT = `${BASE_LOGIN_ENDPOINT}after-verification/`;
export const SEND_AUTH_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}send/`;
export const RESEND_AUTH_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}resend/`;
export const VERIFY_CODE_ENDPOINT = `${BASE_SIGNUP_ENDPOINT}verify/`;
export const SEND_PASSWORD_RESET_ENDPOINT = `${BASE_AUTH_ENDPOINT}password/reset/`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${BASE_AUTH_ENDPOINT}password/reset/confirm/`;
export const TOKEN_REFRESH_ENDPOINT = `${BASE_AUTH_ENDPOINT}token-refresh/`;

// User関連（情報、更新等）
export const BASE_USER_ENDPOINT = `${BASE_AUTH_ENDPOINT}user/`;

export const USER_DETAIL_ENDPOINT = `${BASE_USER_ENDPOINT}detail/`;
export const USER_UPDATE_ENDPOINT = `${BASE_USER_ENDPOINT}update/`;

// お問合せ
export const BASE_CONTACT_ENDPOINT = `/api/contact/`;
export const ANONYMOUS_CONTACT_ENDPOINT = `${BASE_CONTACT_ENDPOINT}anonymous/`;
export const AUTHENTICATED_CONTACT_ENDPOINT = `${BASE_CONTACT_ENDPOINT}authenticated/`;

// 画像
export const IMAGE_REMOVE_BG_ENDPOINT = `/api/image/remove-bg/`;

// ファッションアイテム関連
export const BASE_FASHION_ITEMS_ENDPOINT = '/api/fashion-items/';

export const BRAND_SEARCH_ENDPOINT = `${BASE_FASHION_ITEMS_ENDPOINT}brands/search/`;
export const FASHION_ITEM_METADATA_ENDPOINT = `${BASE_FASHION_ITEMS_ENDPOINT}metadata/`;
export const FASHION_ITEMS_ENDPOINT = `${BASE_FASHION_ITEMS_ENDPOINT}items/`;
export const FASHION_ITEMS_BY_CATEGORY_ENDPOINT = `${FASHION_ITEMS_ENDPOINT}by_category/?category_id=`;

// コーディネート関連
export const BASE_COORDINATE_ENDPOINT = '/api/coordinate/';

export const COORDINATE_METADATA_ENDPOINT = `${BASE_COORDINATE_ENDPOINT}metadata/`;
export const COORDINATE_CREATE_PHOTO_ENDPOINT = `${BASE_COORDINATE_ENDPOINT}photo-coordination/`;
export const COORDINATE_CREATE_CUSTOM_ENDPOINT = `${BASE_COORDINATE_ENDPOINT}custom-coordination/`;

/* ----------------------------------------------------------------
URL
------------------------------------------------------------------ */
// バックエンド
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// トップ
// 一旦my-closetをTOP_URLをmy-closetとして使用
// export const MY_CLOSET_URL = '/my-closet';
export const TOP_URL = '/my-closet';
// export const TOP_URL = '/top';
export const APP_ABOUT_URL = '/';

// 認証系
export const LOGIN_URL = '/auth/login';
export const LOGIN_ERROR_URL = '/auth/login/error';
export const SIGN_UP_URL = '/auth/sign-up';
export const CONFIRM_CODE_URL = '/auth/confirm';
export const PASSWORD_RESET_URL = '/auth/password/reset';

// legal系
export const PRIVACY_URL = '/legal/privacy';
export const TERMS_URL = '/legal/terms';

// コンタクト
export const CONTACT_URL = '/contact';

// マイページ
// export const MY_PAGE_URL = '/my-page';
export const MY_PAGE_URL = '/my-closet';

// ファッションアイテム
export const ITEM_CREATE_URL = '/outfit/item/create';

// コーディネート作成
export const COORDINATE_CREATE_URL = '/outfit/coordinate/create';
export const COORDINATE_CREATE_CANVAS_URL = '/outfit/coordinate/create/canvas';

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
export const DEFAULT_USER_IMAGE = '/images/default.webp';

/* ----------------------------------------------------------------
SEARCH
------------------------------------------------------------------ */
export const MIN_SEARCH_LENGTH = 2;
export const CACHE_DURATION = 5 * 60 * 1000; // 5分

/* ----------------------------------------------------------------
CANVAS
------------------------------------------------------------------ */
export const MOVEMENT_THRESHOLD = 15; // この距離（px）以上マウスを動かすまで回転しない
export const SNAP_THRESHOLD = 2; // 指定された角度の±2度以内でスナップする
export const SNAP_ANGLES = [0, 90, 180, 270, 360]; // スナップする角度のリスト（度）

/* ----------------------------------------------------------------
画面サイズ
------------------------------------------------------------------ */
// 定数を外部に定義
export const ORIGINAL_HEIGHT = 1080;
export const ORIGINAL_WIDTH = 3840;
export const DEFAULT_DIMENSIONS = { width: 1920, height: 1080, scale: 1 };
