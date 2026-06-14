import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isDestructive = true,
  isLoading = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  isDestructive?: boolean
  isLoading?: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[92vw] max-w-sm rounded-xl p-4 sm:p-6"
      >
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-base sm:text-lg md:text-xl leading-snug">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm"
          >
            বাতিল করুন
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            onClick={() => onConfirm()}
            disabled={isLoading}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm"
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            মুছে ফেলুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
