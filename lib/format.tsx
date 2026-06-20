import type { ReactNode } from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function renderFormattedAnswer(text: string) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h3 className="formatted-heading text-lg" {...props} />,
        h2: ({ node, ...props }) => <h3 className="formatted-heading text-lg" {...props} />,
        h3: ({ node, ...props }) => <h3 className="formatted-heading text-lg" {...props} />,
        h4: ({ node, ...props }) => <h4 className="formatted-heading text-base" {...props} />,
        h5: ({ node, ...props }) => <h5 className="formatted-heading text-sm" {...props} />,
        h6: ({ node, ...props }) => <h5 className="formatted-heading text-sm" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1 marker:text-primary marker:font-bold" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1 marker:text-primary marker:font-bold" {...props} />
        ),
        li: ({ node, ...props }) => <li className="pl-1 mb-1 leading-[1.8]" {...props} />,
        p: ({ node, ...props }) => <p {...props} />,
        a: ({ node, ...props }) => <a rel="noreferrer" target="_blank" {...props} />,
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "")
          const isInline = !match && !className?.includes("language-")
          if (isInline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
          return (
            <div className="my-3 overflow-hidden rounded-md border border-border">
              <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5 border-b text-xs font-medium text-muted-foreground">
                <span>{match?.[1] || "code"}</span>
              </div>
              <div className="overflow-x-auto bg-muted/20 p-4">
                <code className="text-sm font-mono text-foreground !bg-transparent !border-0 !p-0" {...props}>
                  {children}
                </code>
              </div>
            </div>
          )
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-primary/60 bg-primary/5 pl-4 py-2 pr-2 italic my-3 text-muted-foreground rounded-r" {...props} />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-3 border rounded-md">
            <table className="w-full text-sm text-left border-collapse" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => <th className="border-b px-4 py-2 bg-muted/50 font-medium text-foreground" {...props} />,
        td: ({ node, ...props }) => <td className="border-b px-4 py-2" {...props} />,
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
