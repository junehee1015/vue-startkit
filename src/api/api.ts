import { ofetch } from 'ofetch'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = ofetch.create({
  baseURL: BASE_URL,

  onRequest({ options }) {
    const token = localStorage.getItem('accessToken')

    if (token) {
      const headers = new Headers(options.headers)
      headers.set('Authorization', `Bearer ${token}`)

      options.headers = headers
    }
  },

  onResponseError({ response }) {
    if (response.status === 401) {
      console.warn('세션이 만료되었습니다.')
    }
  },
})
