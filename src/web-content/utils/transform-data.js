import dayjs from 'dayjs'
// import { fixedNumber } from '@mctech/biz-data-utils'

import { getQuantity } from './calculation'

const types = {
  text: (value) => {
    return value.trim()
  },
  date: (value) => {
    return dayjs(value).isValid() ? dayjs(value).$d : null
  },
  number: (value, decimal, retainNull = false) => {
    if (retainNull && (value == null || value === '')) {
      return null
    }
    return getQuantity(decimal, value * 1)
  },
  boolean: (value) => {
    return ['true', 'TRUE', '是'].includes(value)
  },
  string: (value) => {
    return value.trim()
  }
}

const transformData = (type, value, decimal, retainNull) => {
  const toLowerCaseType = (type || 'text').toLowerCase()
  return types[toLowerCaseType](value, decimal, retainNull)
}

export {
  transformData
}
