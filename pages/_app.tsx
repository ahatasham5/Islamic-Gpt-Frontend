import type { AppProps } from "next/app"
import { Inter, Plus_Jakarta_Sans, Geist_Mono, Amiri } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import "@/app/globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" })
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

// Arabic font — clear harakat rendering
const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${geistMono.variable} ${amiri.variable} bg-background font-sans`}
    >
      <LanguageProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </LanguageProvider>
    </div>
  )
}
