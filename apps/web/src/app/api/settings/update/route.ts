import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { processUpdateProfile } from '@/app/dashboard/settings/update-profile'

/** POST /api/settings/update - form POST with credentials so cookies are sent (fixes Vercel). */
export async function POST(request: Request) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized', errors: null },
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const result = await processUpdateProfile(formData)

  if (result.success) {
    revalidatePath('/dashboard/settings')
  }

  return NextResponse.json(result)
}
