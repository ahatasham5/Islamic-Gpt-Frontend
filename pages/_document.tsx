import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="bn">
      <Head>
        <link rel="icon" href="/iqa-logo.png" />
        <link rel="apple-touch-icon" href="/iqa-logo.png" />
        <meta name="theme-color" content="#0f766e" />
      </Head>
      <body className="antialiased" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
