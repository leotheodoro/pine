import './globals.css'

import { Geist, Geist_Mono as GeistMono } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/providers/query-client'

export const metadata = {
  title: 'App | Pine',
  description:
    'A calm, single-user developer dashboard that aggregates pull requests waiting for your review from Bitbucket and Azure DevOps—helping you stay focused, consistent, and in control of your daily code reviews.',
  icons: {
    icon: '/icon.svg',
  },
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
