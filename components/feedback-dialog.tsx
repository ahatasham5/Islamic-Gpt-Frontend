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
      <DialogContent showCloseButton={false} className="w-[93vw] sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-base sm:text-lg">মতামত দিন (Mufti Feedback)</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm mt-1">
            এই উত্তরটির মান যাচাই করুন এবং বিস্তারিত মতামত লিখুন।
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:gap-4 py-2 flex-1 min-h-0 overflow-y-auto">
          {/* Rating Selection */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedIsGood(true)}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition hover:bg-accent/40",
                selectedIsGood === true
                  ? "border-green-600/40 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <ThumbsUp className="size-3.5 sm:size-4" />
              সঠিক উত্তর
            </button>
            <button
              type="button"
              onClick={() => setSelectedIsGood(false)}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition hover:bg-accent/40",
                selectedIsGood === false
                  ? "border-red-600/40 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              <ThumbsDown className="size-3.5 sm:size-4" />
              ভুল উত্তর
            </button>
          </div>

          <RichTextEditor
            defaultValue={text}
            onChange={(val) => setText(val)}
          />
        </div>

        <DialogFooter className="shrink-0 mt-3 sm:mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm"
          >
            বাতিল
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (selectedIsGood === null && text.trim() === "")}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm"
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            জমা দিন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
