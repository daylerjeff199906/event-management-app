// app/providers.tsx
'use client'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'next-themes'
import 'react-toastify/dist/ReactToastify.css'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <ToastContainer theme="dark" position="bottom-right" />
        {children}
      </ThemeProvider>
    </>
  )
}
