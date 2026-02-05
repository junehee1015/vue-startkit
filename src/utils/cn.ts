import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind 클래스를 병합
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
