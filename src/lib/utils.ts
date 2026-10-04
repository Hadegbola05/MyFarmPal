import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as Supabase from '@supabase/supabase-js'
import { toast } from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastSupabaseError(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = String((error as Supabase.PostgrestError).message || fallback)
    const details = 'details' in error && (error as Supabase.PostgrestError).details
      ? String((error as Supabase.PostgrestError).details)
      : undefined
    const text = details ? msg + ' — ' + details : msg || fallback
    toast.error(text)
    return
  }
  toast.error(fallback)
}
