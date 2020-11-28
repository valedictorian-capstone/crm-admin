export interface LoginGM {
  emailOrPhone: string;
  password: string;
}
export interface TokenVM {
  expiresIn: string;
  accessToken: string;
  roles: string[];
  fullname: string;
  avatar: string;
  id: string;
}
