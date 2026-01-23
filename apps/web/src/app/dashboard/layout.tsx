'use client'

import { BarChart3, List, LogOut, Menu, Scale, Settings, UserCheck, UserX, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProfile, useUserRole } from '@/hooks/use-profile'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const userRole = useUserRole()
  const { data: profile } = useProfile()

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Leads', href: '/dashboard/leads', icon: List },
  ]

  const partesNavigation = [
    { name: 'Advogados', href: '/dashboard/lawyers', icon: Scale },
    { name: 'Devedores', href: '/dashboard/defendants', icon: UserX },
    { name: 'Autores', href: '/dashboard/authors', icon: UserCheck },
  ]

  const bensNavigation: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }> = []

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-start gap-3 px-3 py-2 hover:bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {profile?.user?.name ? getInitials(profile.user.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-900">{profile?.user?.name || 'Usuário'}</span>
            <span className="text-xs text-gray-500">{profile?.user?.email || ''}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        {userRole === 'MASTER' && (
          <>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out" className="flex w-full cursor-pointer items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', sidebarOpen ? 'block' : 'hidden')}>
        <div className="fixed inset-0 bg-gray-600/75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Image src="/icon.svg" alt="Pine" width={32} height={32} />
              <span className="text-primary text-xl font-bold">Pine</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                      pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Partes Section */}
            <div className="pt-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Partes</h3>
              <div className="space-y-1">
                {partesNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                        pathname === item.href
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bens Section */}
            {bensNavigation.length > 0 && (
              <div className="pt-4">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Bens</h3>
                <div className="space-y-1">
                  {bensNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                          pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User Profile Dropdown */}
          <div className="border-t border-gray-200 p-2">
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image src="/icon.svg" alt="Pine" width={32} height={32} />
              <span className="text-primary text-xl font-bold">Pine</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
            {/* Main Navigation */}
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                      pathname === item.href
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Partes Section */}
            <div className="pt-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Partes</h3>
              <div className="space-y-1">
                {partesNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                        pathname === item.href
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bens Section */}
            {bensNavigation.length > 0 && (
              <div className="pt-4">
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Bens</h3>
                <div className="space-y-1">
                  {bensNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                          pathname === item.href
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User Profile Dropdown */}
          <div className="border-t border-gray-200 p-2">
            <UserProfileDropdown />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <main className="pt-3 pb-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
