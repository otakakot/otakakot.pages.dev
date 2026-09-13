const USER_ID_KEY = 'user_id'

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  return localStorage.getItem(USER_ID_KEY)
}

export function setStoredUserId(userId: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  localStorage.setItem(USER_ID_KEY, userId)
}

export function clearStoredUserId(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  localStorage.removeItem(USER_ID_KEY)
}
