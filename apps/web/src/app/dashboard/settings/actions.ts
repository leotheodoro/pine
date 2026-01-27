'use server'

import { HTTPError } from 'ky'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { updateProfile } from '@/http/users/update-profile'

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bitbucket_email: z.string().optional(),
  bitbucket_api_token: z.string().optional(),
  bitbucket_workspace: z.string().optional(),
  azure_devops_org: z.string().optional(),
  azure_devops_pat: z.string().optional(),
  azure_devops_project: z.string().optional(),
  repositories: z
    .array(
      z.object({
        provider: z.enum(['bitbucket', 'azure']),
        identifier: z.string(),
      })
    )
    .optional(),
})

export async function updateProfileAction(data: FormData) {
  const jsonData = Object.fromEntries(data)
  const repositories: { provider: 'bitbucket' | 'azure'; identifier: string }[] = []

  for (const [key, value] of data.entries()) {
    const match = key.match(/repositories\[(\d+)\]\[(\w+)\]/)
    if (match) {
      const index = Number(match[1])
      const field = match[2] as 'provider' | 'identifier'

      if (!repositories[index]) {
        repositories[index] = {} as { provider: 'bitbucket' | 'azure'; identifier: string }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      repositories[index][field] = value as any
    }
  }

  const result = updateProfileSchema.safeParse({
    ...jsonData,
    repositories: repositories.filter((repo) => repo.provider && repo.identifier), // Filter out empty or incomplete ones if any
  })

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  try {
    await updateProfile(result.data)

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      message: 'Profile updated successfully',
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      console.log(error)
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }
}
