'use client'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface CompletionScreenProps {
  centerImageUrl: string
  centerImageAlt?: string
  title: string
  description: string
}

export const CompletionScreen = ({
  centerImageUrl,
  centerImageAlt = 'Completion illustration',
  title,
  description
}: CompletionScreenProps) => {
  // Trigger confetti effect on component mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-8 rounded-2xl">
      {/* Decorative elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating decorative shapes */}
        <div className="absolute top-20 left-10 w-6 h-6 rounded-full border-2 border-pink-300 opacity-60" />
        <div className="absolute top-32 right-16 w-8 h-8 rounded-full border-2 border-purple-300 opacity-50" />
        <div className="absolute top-40 left-1/4 w-4 h-4 bg-yellow-300 rounded-full opacity-70" />
        <div className="absolute top-24 right-1/3 w-5 h-5 bg-yellow-300 rounded-full opacity-60" />

        {/* Wavy lines */}
        <svg
          className="absolute top-32 left-1/3 w-12 h-12 opacity-40"
          viewBox="0 0 100 100"
        >
          <path
            d="M 10 50 Q 20 40, 30 50 T 50 50"
            stroke="#7dd3c0"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 10 60 Q 20 50, 30 60 T 50 60"
            stroke="#7dd3c0"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        <svg
          className="absolute top-48 right-1/4 w-12 h-12 opacity-40"
          viewBox="0 0 100 100"
        >
          <path
            d="M 10 50 Q 20 40, 30 50 T 50 50"
            stroke="#7dd3c0"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 10 60 Q 20 50, 30 60 T 50 60"
            stroke="#7dd3c0"
            strokeWidth="3"
            fill="none"
          />
        </svg>

        {/* Plus signs */}
        <div className="absolute top-36 right-1/3 text-green-400 text-2xl opacity-60">
          +
        </div>
        <div className="absolute top-56 right-20 text-green-400 text-2xl opacity-60">
          +
        </div>

        {/* Circles */}
        <div className="absolute bottom-1/3 left-1/4 w-5 h-5 rounded-full border-2 border-pink-300 opacity-50" />
        <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full border-2 border-pink-300 opacity-40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-red-500 tracking-wide">
          {title}
        </h1>
        {/* Center image */}
        <div className="mb-8 md:mb-12">
          <Image
            src={centerImageUrl || '/placeholder.svg'}
            alt={centerImageAlt}
            width={500}
            height={500}
            className="w-48 h-56 md:w-56 md:h-72 object-cover drop-shadow-lg"
          />
        </div>

        {/* Decorative dots around title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-red-500" />
        </div>

        {/* Description */}
        <p className="text-center text-gray-400 text-sm md:text-base mb-10 md:mb-14 leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </div>
  )
}
