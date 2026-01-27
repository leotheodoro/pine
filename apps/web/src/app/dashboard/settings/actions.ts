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
})

export async function updateProfileAction(data: FormData) {
  const result = updateProfileSchema.safeParse(Object.fromEntries(data))

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
