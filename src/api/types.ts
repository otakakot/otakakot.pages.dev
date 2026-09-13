export interface SigninRequest {
  email: string
  password: string
}

export interface SigninResponse {
  user_id: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
}
