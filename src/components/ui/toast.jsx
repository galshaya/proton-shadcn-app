"use client"

import React from 'react'
import { X } from 'lucide-react'
import { useToast } from './use-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start justify-between p-4 rounded-md shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-right-5",
            toast.variant === 'destructive' 
              ? "bg-red-950 border-red-800 text-white" 
              : "bg-gray-900 border-gray-800 text-white"
          )}
        >
          <div className="grid gap-1">
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
