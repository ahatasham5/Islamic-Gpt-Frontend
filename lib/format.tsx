import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function renderFormattedAnswer(text: string): ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p>{children}</p>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => <code>{children}</code>,
        h1: ({ children }) => <h3 className="formatted-heading text-lg">{children}</h3>,
        h2: ({ children }) => <h3 className="formatted-heading text-lg">{children}</h3>,
        h3: ({ children }) => <h3 className="formatted-heading text-lg">{children}</h3>,
        h4: ({ children }) => <h4 className="formatted-heading text-base">{children}</h4>,
        h5: ({ children }) => <h5 className="formatted-heading text-sm">{children}</h5>,
        h6: ({ children }) => <h5 className="formatted-heading text-sm">{children}</h5>,
        ul: ({ children }) => <ul className="space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="space-y-1">{children}</ol>,
        li: ({ children }) => (
          <p className="formatted-list-item">
            <span>•</span>
            <span>{children}</span>
          </p>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-link"
          >
            {children}
          </a>
        ),
      }}
    >
      {text || ""}
    </ReactMarkdown>
  )
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function formatDate(value: string) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function percent(value: number) {
  return `${Math.round(value * 100)}%`
}
