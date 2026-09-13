import { API_BASE_URL } from './config'
import { ApiError } from './errors'
import type { ApiErrorResponse } from './types'

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...restOptions } = options
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  }

  let serializedBody: BodyInit | null | undefined
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
    serializedBody = JSON.stringify(body)
  }

  const response = await fetch(url, {
    ...restOptions,
    credentials: 'include',
    headers: requestHeaders,
    body: serializedBody,
  })

  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined
    try {
      errorData = (await response.json()) as ApiErrorResponse
    } catch {
      // JSONパースに失敗した場合は未定義のまま
    }
    throw new ApiError(response.status, response.statusText, errorData)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
