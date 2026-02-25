'use client'

import { Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CompletionScreenProps {
  title: string
  description: string
}

export const CompletionScreen = ({
  title,
  description
}: CompletionScreenProps) => {
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Checkmark Icon Container */}
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-10 shadow-lg shadow-primary/20 animate-in zoom-in duration-500">
        <Check className="w-8 h-8 text-white stroke-[3px]" />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 font-medium tracking-tight">
          {description}
        </p>
      </div>
    </div>
  )
}
