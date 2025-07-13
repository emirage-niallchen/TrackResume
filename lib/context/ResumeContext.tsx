"use client";

import { createContext, useContext } from 'react'

interface ResumeContextType {
  params: { [key: string]: string | string[] | undefined }
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: { [key: string]: string | string[] | undefined }
}) {
  return (
    <ResumeContext.Provider value={{ params }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResumeContext() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider')
  }
  return context
} 