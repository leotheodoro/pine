'use client'

import { useEffect, useState } from 'react'

import { useProfile } from '@/hooks/use-profile'

export function Greeting() {
  const { data: profile } = useProfile()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 18) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  return (
    <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground">
      {greeting} {profile?.user.name.split(' ')[0]}
    </h1>
  )
}
