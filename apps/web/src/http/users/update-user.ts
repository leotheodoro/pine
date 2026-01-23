import { api } from '@/lib/ky'

export interface UpdateUserRequest {
  id: string
  name?: string
  email?: string
  password?: string
  username: string
  avatarUrl?: string
}

export async function updateUser({ id, ...data }: UpdateUserRequest) {
  // Remove keys with undefined or empty string values before sending
  const payload: Record<string, string> = {}

  payload.avatar_url = data.avatarUrl ?? ''

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      payload[key] = value as string
    }
  })

  await api.patch(`users/${id}`, {
    json: payload,
  })
}
