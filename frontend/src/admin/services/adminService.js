import adminApi from './adminApi'

export async function adminLogin(credentials) {
  const { data } = await adminApi.post('/admin/login/', credentials)
  return data
}

export async function getAdminStats() {
  const { data } = await adminApi.get('/admin/stats/')
  return data
}

export async function getAdminUsers() {
  const { data } = await adminApi.get('/admin/users/')
  return data
}

export async function updateUserStatus(userId, isActive) {
  const { data } = await adminApi.patch(`/admin/users/${userId}/block/`, { is_active: isActive })
  return data
}

export async function deleteAdminUser(userId) {
  await adminApi.delete(`/admin/users/${userId}/`)
}

export async function getAdminHistory() {
  const { data } = await adminApi.get('/admin/history/')
  return data
}
