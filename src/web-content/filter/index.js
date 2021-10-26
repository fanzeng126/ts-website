import Vue from 'vue'
import dayjs from 'dayjs'
import nzhcn from 'nzh/cn'
import { isNumber, round } from 'lodash-es'

Vue.filter('formatDate', (date, formatTemplate = 'YYYY-MM-DD') => {
  return date ? dayjs(date).format(formatTemplate) : ''
})

Vue.filter('fixedNumber', (price, type = 'price') => {
  return isNumber(price) ? round(price, 2) : ''
})

Vue.filter('convertNumberToChinese', number => {
  return isNumber(number) ? nzhcn.toMoney(number, { complete: true }) : ''
})

Vue.filter('getFileSize', size => {
  const unit = ['Bytes', 'KB', 'MB', 'GB']
  let unitIndex = 0
  let leftSize = size
  while (unitIndex < unit.length && leftSize > 1024) {
    leftSize = leftSize / 1024
    unitIndex++
  }
  return `${round(leftSize, 2)}${unit[unitIndex]}`
})
