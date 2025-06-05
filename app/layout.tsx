import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'Lara e Rafa',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.png', // ícone de coração, por exemplo
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
