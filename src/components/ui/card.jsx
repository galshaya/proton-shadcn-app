import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-[#111111] border border-gray-800 rounded-lg text-white",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "p-6 flex flex-col gap-1.5",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <h3
      className={cn("text-lg font-light text-white", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <p
      className={cn("text-sm text-gray-400", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
