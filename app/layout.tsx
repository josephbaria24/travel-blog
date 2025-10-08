import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Geist } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const poppins = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // include the weights you plan to use
})

export const metadata: Metadata = {
  title: "Slowanderain",
  description: "Explore the world through our eyes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
     <body className={poppins.className}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
