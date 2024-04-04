import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { siteConfig } from '@/config/site'

import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex min-h-screen flex-col space-y-6'>
            <header className='sticky top-0 z-40 border-b bg-background'>
              <div className='container flex h-16 items-center justify-between py-4'>
                <Header />
              </div>
            </header>
            <div className='container grid flex-1 gap-12'>
              <main className='flex w-full flex-1 flex-col overflow-hidden'>
                {children}
              </main>
            </div>
            <Footer className='border-t' />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
