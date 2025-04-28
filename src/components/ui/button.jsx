import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-white/90",
        destructive:
          "bg-red-600/20 text-red-400 hover:bg-red-600/30",
        outline:
          "border border-gray-700 bg-transparent text-white hover:bg-gray-800",
        secondary:
          "bg-[#222] text-white hover:bg-[#333]",
        ghost:
          "text-gray-400 hover:bg-gray-800 hover:text-white",
        link: 
          "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-1",
        lg: "h-10 rounded-md px-6 py-2",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} 
    />
  );
}

export { Button, buttonVariants }
