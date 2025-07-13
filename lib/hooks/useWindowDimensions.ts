'use client'

import { useState, useEffect } from 'react'

interface WindowDimensions {
  width: number | undefined
  height: number | undefined
}

/**
 * 获取窗口尺寸的 Hook
 * @returns {WindowDimensions} 窗口尺寸对象
 */
export const useWindowDimensions = (): WindowDimensions => {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    const handleResize = (): void => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
} 