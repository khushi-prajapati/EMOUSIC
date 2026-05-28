const ACCESS_TOKEN_KEY = 'moodtunes_access_token'
const REFRESH_TOKEN_KEY = 'moodtunes_refresh_token'

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}
