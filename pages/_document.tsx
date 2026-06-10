import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="bn">
      <Head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light-32x32.png" type="image/png" media="(prefers-color-scheme: light)" sizes="32x32" />
        <link rel="icon" href="/icon-dark-32x32.png" type="image/png" media="(prefers-color-scheme: dark)" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#0f766e" />
      </Head>
      <body className="antialiased" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
