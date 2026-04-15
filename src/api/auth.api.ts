import api from '@/lib/axios'

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface User {
  _id: string
  name: string
  email: string
}

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export const getMe = async (): Promise<{ user: User }> => {
  const { data } = await api.get<{ user: User }>('/auth/me')
  return data
}