import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { ShopProvider } from "@/lib/shop-context"
import { Toaster } from "sonner"
import { ChatWidget } from "@/components/chat-widget"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Sri Sai Cottage Industries",
  description: "Authentic Pooja Items and Traditional Crafts",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">
        <ShopProvider>
          <CartProvider>
            {children}
            <ChatWidget />
            <Toaster />
          </CartProvider>
        </ShopProvider>
      </body>
    </html>
  )
}
