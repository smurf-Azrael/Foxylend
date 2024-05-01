import "@/styles/globals.css"
import { Metadata } from "next"
import { Toaster } from "react-hot-toast"

import { siteConfig } from "@/config/site"
import { fontBebas, fontExo2, fontInria, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/header/site-header"
import { SeiProvider } from "@/components/sei-provider"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "font-exo2 min-h-screen bg-[#181616] text-white antialiased",
            fontSans.variable,
            fontBebas.variable,
            fontExo2.variable,
            fontInria.variable
          )}
        >
          <SeiProvider
            chainConfiguration={{
              chainId: "pacific-1",
              restUrl: "https://sei-rpc.brocha.in/",
              rpcUrl: "https://sei-rpc.brocha.in/",
            }}
            wallets={["compass", "fin"]}
            autoConnect="compass"
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster />
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
              <TailwindIndicator />
            </ThemeProvider>{" "}
          </SeiProvider>
        </body>
      </html>
    </>
  )
}
