import { api } from '@/lib/ky'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export async function login({ email, password }: LoginRequest) {
  const result = await api
    .post('authenticate', {
      json: {
        email,
        password,
      },
    })
    .json<LoginResponse>()

  return result
}
