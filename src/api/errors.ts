import type { ApiErrorResponse } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly statusText: string
  readonly data?: ApiErrorResponse

  constructor(status: number, statusText: string, data?: ApiErrorResponse) {
    const message =
      data?.message || data?.error || `API request failed with status ${status}`
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}
