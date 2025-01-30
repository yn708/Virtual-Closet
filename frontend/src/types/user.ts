/* ----------------------------------------------------------------
ユーザー情報
------------------------------------------------------------------ */
export interface UserType {
  userId: string;
  username: string;
  name?: string;
  email: string;
  birth_date?: string;
  gender?: 'unanswered' | 'male' | 'female' | 'other';
  profile_image?: string;
  height?: string;
}

export interface UserDetailType {
  userDetail: Partial<UserType>;
}
