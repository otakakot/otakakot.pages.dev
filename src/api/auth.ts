import { apiClient } from './client'
import type { SigninRequest, SigninResponse } from './types'

export async function signin(
  credentials: SigninRequest,
): Promise<SigninResponse> {
  return apiClient<SigninResponse>('/signin', {
    method: 'POST',
    body: credentials,
  })
}

export async function signout(): Promise<void> {
  return apiClient<void>('/signout', {
    method: 'POST',
  })
}
