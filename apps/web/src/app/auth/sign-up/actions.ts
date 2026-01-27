'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { createUser } from '@/http/users/create-user'
import { login } from '@/http/users/login'

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Please, provide your name' }),
    email: z.string().email({ message: 'Please, provide a valid e-mail address' }),
    username: z.string().min(1, { message: 'Please, provide a username' }),
    password: z.string().min(3, { message: 'Password must be at least 3 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export async function signUp(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, username, password } = result.data

  try {
    // Create the user
    await createUser({
      name,
      email,
      username,
      password,
    })

    // Automatically log in the user
    const { token } = await login({
      email,
      password,
    })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      // Handle specific error for user already exists
      if (error.response.status === 409) {
        return { success: false, message: 'User already exists with this email', errors: null }
      }

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }

  return {
    success: true,
    message: null,
    errors: null,
  }
}
