import { api } from '@/lib/ky'

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  username: string
  avatarUrl?: string
}

export interface CreateUserResponse {
  id: string
}

export async function createUser({ name, email, password, username, avatarUrl }: CreateUserRequest) {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
        username,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      },
    })
    .json<CreateUserResponse>()

  return result
}
