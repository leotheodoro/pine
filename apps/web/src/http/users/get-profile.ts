import { api } from '@/lib/ky'

interface GetProfileResponse {
  user: {
    id: string
    name: string
    email: string
    username: string
    avatar_url?: string
    bitbucket_email?: string
    bitbucket_api_token?: string
    bitbucket_workspace?: string
    azure_devops_org?: string
    azure_devops_pat?: string
    azure_devops_project?: string
    repositories: {
      id: string
      provider: 'bitbucket' | 'azure'
      identifier: string
    }[]
  }
}

export async function getProfile() {
  const result = await api.get('profile').json<GetProfileResponse>()

  return result
}
