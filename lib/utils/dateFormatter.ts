import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 统一的日期格式化函数
 * @param {Date} date - 需要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date: Date): string => {
  try {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  } catch (error) {
    console.error('日期格式化错误:', error)
    return ''
  }
}

/**
 * 履历日期格式化函数 (年月日)
 * @param {Date} date - 需要格式化的日期
 * @returns {string} 格式化后的日期字符串 (如: 2024年3月1日)
 */
export const formatResumeDate = (date: Date): string => {
  try {
    return format(date, 'yyyy年MM月dd日', { locale: zhCN })
  } catch (error) {
    console.error('日期格式化错误:', error)
    return ''
  }
} 