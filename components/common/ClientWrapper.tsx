'use client'

import { useEffect, useState } from 'react'
import { type ReactNode } from 'react'
import PropTypes from 'prop-types'

/**
 * 客户端渲染包装器组件
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 子组件
 * @returns {ReactNode | null} 渲染的组件或空
 */
const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <>{children}</> : null
}

ClientWrapper.propTypes = {
  children: PropTypes.node.isRequired
}

export default ClientWrapper