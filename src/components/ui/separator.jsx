"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      className={cn(
        "shrink-0 bg-gray-800",
        orientation === "horizontal" ? "h-[1px] w-full my-4" : "h-full w-[1px] mx-4",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
