import type { Metadata } from 'next'
// @ts-ignore: global CSS import declaration not found in this project setup
import './globals.css'

export const metadata: Metadata = {
  title: 'Dima Krib Lik',
  description: 'Distribution — Gestion bout en bout',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
