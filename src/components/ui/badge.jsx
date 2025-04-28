import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black",
        secondary:
          "bg-[#222222] text-white",
        destructive:
          "bg-red-600 text-white",
        outline: 
          "border border-gray-700 bg-transparent text-white",
        active: 
          "bg-green-500 text-black",
        archived:
          "bg-blue-700 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
