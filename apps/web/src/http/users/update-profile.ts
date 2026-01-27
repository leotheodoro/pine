import { api } from '@/lib/ky'

interface UpdateProfileRequest {
  name?: string
  email?: string
  bitbucket_email?: string
  bitbucket_api_token?: string
  bitbucket_workspace?: string
  azure_devops_org?: string
  azure_devops_pat?: string
  azure_devops_project?: string
  repositories?: {
    provider: 'bitbucket' | 'azure'
    identifier: string
  }[]
}

export async function updateProfile(data: UpdateProfileRequest) {
  await api.put('users', {
    json: data,
  })
}
