import { api } from '@/lib/ky'

interface GetProfileResponse {
  user: {
    id: string
    name: string
    email: string
    username: string
    avatar_url?: string
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()

  return result
}
