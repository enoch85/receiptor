import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Receiptor - Smart Household Budget Tracker',
  description: 'Track your household grocery spending with AI-powered insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
