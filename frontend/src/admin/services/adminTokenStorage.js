const ADMIN_ACCESS_TOKEN_KEY = 'moodtunes_admin_access_token'
const ADMIN_REFRESH_TOKEN_KEY = 'moodtunes_admin_refresh_token'

export function getAdminAccessToken() {
  return sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY)
}

export function getAdminRefreshToken() {
  return sessionStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)
}

export function setAdminTokens(tokens) {
  sessionStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, tokens.access)
  sessionStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, tokens.refresh)
}

export function clearAdminTokens() {
  sessionStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
}
