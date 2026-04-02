import { ofetch } from 'ofetch'
import type { LoginPayload, User } from '@/features/auth/model/store'
import { api } from '@/lib/api'

interface LoginResponse {
  accessToken: string
  email: string
  user: User
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const loginApi = (body: LoginPayload) =>
  ofetch<LoginResponse>('login', { baseURL: BASE_URL, method: 'post', body })

export const logoutApi = () => api<void>('logout', { method: 'post', credentials: 'include' })
