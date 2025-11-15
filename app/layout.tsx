import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { RootLayoutWrapper } from '@/components/root-layout-wrapper'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SecurityX | Advanced Security Platform',
  description: 'Professional website vulnerability scanning, alert management, and security monitoring',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>SecurityX | Advanced Security Platform</title>
        <meta name="description" content="Professional website vulnerability scanning, alert management, and security monitoring" />
      </head>
      <body className={`font-sans antialiased`}>
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
        
        <Analytics />
        <Script
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
