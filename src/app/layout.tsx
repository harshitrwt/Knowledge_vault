'use client'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Nunito } from 'next/font/google';
import { DashedScrollAnimation } from '@/components/DashedScrollAnimation';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito'
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={nunito.variable}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <DashedScrollAnimation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
