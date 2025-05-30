import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'My Next.js App',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body>{children}</body>
    </html>
  )
}
