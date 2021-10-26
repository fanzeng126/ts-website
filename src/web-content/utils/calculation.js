import { fixedNumber } from '@mctech/biz-data-utils'

export const getQuantity = (type, quantity, hasRebar = false) => {
  const { fixedNumber: fixedNum } = fixedNumber

  const obj = {
    default: num => fixedNum(num, 3), // 默认，三位
    round: num => fixedNum(num, 0), // 四舍五入取整
    floor: num => Math.floor(num), // 向下取整
    ceil: num => Math.ceil(num), // 向上取整
    double1: num => fixedNum(num, 1), // 1位小数
    double2: num => fixedNum(num, 2), // 2位小数
    double3: num => fixedNum(num, 3), // 3位小数
    double4: num => fixedNum(num, 4), // 4位小数
    double5: num => fixedNum(num, 5), // 5位小数
    double2_3: num => fixedNum(num, hasRebar ? 3 : 2) // 5位小数
  }

  const funcName = obj[type] ? type : 'double2'
  const value = isNaN(quantity) ? 0 : quantity
  return quantity == null ? null : obj[funcName](value, hasRebar)
}
