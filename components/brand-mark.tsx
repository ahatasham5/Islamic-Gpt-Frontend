import Image from "next/image"
import { cn } from "@/lib/utils"

export function BrandMark({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-border",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        alt="IQA Logo"
        src="/iqa-logo.png"
        width={size}
        height={size}
        priority
        className="h-full w-full object-cover"
      />
    </span>
  )
}
