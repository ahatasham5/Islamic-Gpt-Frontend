import { useRef, useEffect } from "react"
import { Bold, Highlighter, Underline, Italic, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function RichTextEditor({
  defaultValue = "",
  onChange,
}: {
  defaultValue?: string
  onChange: (html: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && defaultValue && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = defaultValue;
    }
  }, [])

  // Sync external resets (like clearing the dialog)
  useEffect(() => {
    if (editorRef.current && defaultValue === "") {
      editorRef.current.innerHTML = "";
    }
  }, [defaultValue])

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Strip HTML and check the first actual text character
  const plainText = defaultValue.replace(/<[^>]*>?/gm, '').trim();
  const isRTL = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(plainText);
  const textDir = plainText.length > 0 ? (isRTL ? "rtl" : "ltr") : "ltr";

  return (
    <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-background focus-within:ring-1 focus-within:ring-primary/50 transition-all">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1">
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('bold')} title="Bold">
          <Bold className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('italic')} title="Italic">
          <Italic className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('underline')} title="Underline">
          <Underline className="size-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('insertUnorderedList')} title="Bullet List">
          <List className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('insertOrderedList')} title="Numbered List">
          <ListOrdered className="size-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => exec('hiliteColor', '#fef08a')} title="Highlight">
          <Highlighter className="size-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className={cn(
          "p-4 h-[350px] outline-none overflow-y-auto overflow-x-hidden text-sm w-full break-all whitespace-pre-wrap",
          textDir === "rtl" ? "text-right" : "text-left"
        )}
        contentEditable
        dir={textDir}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  )
}
