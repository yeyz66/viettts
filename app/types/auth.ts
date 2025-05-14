export interface AuthFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends AuthFormValues {
  name?: string;
}

export interface AuthError {
  code?: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
} 