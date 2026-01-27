'use client'

import { AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { signIn } from './actions'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && theme === 'light' ? '/icon-black.svg' : '/icon.svg'

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(signIn, () => {
    router.push('/')
  })

  return (
    <div className="from-primary/10 to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Image src={logoSrc} alt="Pine Logo" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold">Pine</CardTitle>
          <CardDescription>Painel Administrativo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                defaultValue={searchParams.get('email') ?? ''}
                required
              />

              {errors?.email && <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  defaultValue={searchParams.get('password') ?? ''}
                  autoComplete=""
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                {errors?.password && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 w-full">
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
            </Button>

            {success === false && message && (
              <Alert variant="destructive">
                <AlertTriangle className="size-4" />
                <AlertTitle>Login falhou!</AlertTitle>
                <AlertDescription>
                  <p>{message}</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
