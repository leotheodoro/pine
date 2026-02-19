'use server'

import { revalidatePath } from 'next/cache'

import { processUpdateProfile } from '@/app/dashboard/settings/update-profile'

export type { UpdateProfileResult } from '@/app/dashboard/settings/update-profile'

export async function updateProfileAction(data: FormData) {
  const out = await processUpdateProfile(data)
  if (out.success) {
    revalidatePath('/dashboard/settings')
  }
  return out
}
