export type User = {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
};

export type AuthSession = {
  user: User;
  token: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string | number;
};

export type AuthResponse = {
  success: boolean;
  data?: AuthSession | { user: User };
  error?: string;
  access_token?: string;
};

export type LoginCredentials = { email: string; password: string };
export type RegisterData = { email: string; password: string; name?: string };
