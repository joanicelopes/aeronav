import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })
const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AeroNav",
  description: "Find airport information by code",
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-b.svg', sizes: '32x32', type: 'image/svg' },
      { url: '/icon-b.svg', sizes: '16x16', type: 'image/svg' }
    ],
    apple: [
      { url: '/icon-b.svg', sizes: '180x180', type: 'image/svg' }
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.className} font-mono`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
