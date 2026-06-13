import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { cn } from "@/lib/utils"

export function FeedbackDialog({
  open,
  onOpenChange,
  isGoodInitial,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isGoodInitial: boolean | null
  onSubmit: (isGood: boolean | null, text: string) => Promise<void>
}) {
  const [text, setText] = useState("")
  const [selectedIsGood, setSelectedIsGood] = useState<boolean | null>(isGoodInitial)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setSelectedIsGood(isGoodInitial)
      setText("")
    }
  }, [open, isGoodInitial])

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      await onSubmit(selectedIsGood, text)
      onOpenChange(false)
      setText("")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) {
        setText("")
      } else {
        setSelectedIsGood(isGoodInitial)
      }
    }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[1000px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>মতামত দিন (Mufti Feedback)</DialogTitle>
          <DialogDescription>
            এই উত্তরটির মান যাচাই করুন এবং বিস্তারিত মতামত লিখুন।
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Rating Selection */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedIsGood(true)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent/40",
                selectedIsGood === true ? "border-green-600/40 bg-green-50 text-green-700" : "border-border bg-card text-muted-foreground"
              )}
            >
              <ThumbsUp className="size-4" />
              সঠিক উত্তর
            </button>
            <button
              type="button"
              onClick={() => setSelectedIsGood(false)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-accent/40",
                selectedIsGood === false ? "border-red-600/40 bg-red-50 text-red-700" : "border-border bg-card text-muted-foreground"
              )}
            >
              <ThumbsDown className="size-4" />
              ভুল উত্তর
            </button>
          </div>

          <RichTextEditor
            defaultValue={text}
            onChange={(val) => setText(val)}
          />
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            বাতিল
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || (selectedIsGood === null && text.trim() === '')}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            জমা দিন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
