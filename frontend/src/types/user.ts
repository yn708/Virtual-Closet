/* ----------------------------------------------------------------
ユーザー情報
------------------------------------------------------------------ */
export interface UserType {
  userId: string;
  username: string;
  name: string;
  email: string;
  birth_date?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  profile_image?: string | null;
  height?: string | null;
}

export interface UserDetailType {
  userDetail: Partial<UserType>;
}
