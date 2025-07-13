'use client'

import ClientWrapper from './common/ClientWrapper'
import { formatDate } from '@/lib/utils/dateFormatter'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

interface DateDisplayProps {
  date: Date
}

/**
 * 日期展示组件
 * @param {Object} props - 组件属性
 * @param {Date} props.date - 日期属性
 */
const DateDisplay = ({ date }: DateDisplayProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ClientWrapper>
      <div className="p-4">
        <p>格式化日期: {formatDate(date)}</p>
        <p>窗口尺寸: {dimensions.width} x {dimensions.height}</p>
      </div>
    </ClientWrapper>
  )
}

DateDisplay.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
}

export default DateDisplay