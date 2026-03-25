import { ofetch } from 'ofetch'
import type { LoginPayload, User } from '@/features/auth/model/store'
import { api } from '@/lib/api'

interface LoginResponse {
  accessToken: string
  user: User
}

export const loginApi = async (body: LoginPayload) => {
  return ofetch<LoginResponse>('login', {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    method: 'post',
    body,
  })
}

export const logoutApi = async () => {
  return api<void>('logout', { method: 'post' })
}
