'use client'

import { type FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState
) {
  const [isPending, startTranstion] = useTransition()
  const [formState, setFormState] = useState<FormState>(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    }
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const state = await action(data)

    if (state.success === true && onSuccess) {
      await onSuccess()
    }

    startTranstion(() => {
      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
