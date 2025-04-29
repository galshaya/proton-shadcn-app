// Adapted from https://ui.shadcn.com/docs/components/toast
import { useState, useEffect } from 'react'

export function toast({ title, description, variant = 'default', duration = 5000 }) {
  // Create a custom event
  const event = new CustomEvent('toast', {
    detail: {
      title,
      description,
      variant,
      duration,
    },
  })
  
  // Dispatch the event
  window.dispatchEvent(event)
}

export function useToast() {
  const [toasts, setToasts] = useState([])
  
  useEffect(() => {
    const handleToast = (event) => {
      const { title, description, variant, duration } = event.detail
      const id = Math.random().toString(36).substring(2, 9)
      
      setToasts((prev) => [...prev, { id, title, description, variant, duration }])
      
      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, duration)
    }
    
    window.addEventListener('toast', handleToast)
    return () => window.removeEventListener('toast', handleToast)
  }, [])
  
  return { toasts, dismiss: (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id)) }
}
