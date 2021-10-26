/*
传入对象，去除对象中的假值，O除外
 */
function compactObj (val) {
  const res = Array.isArray(val) ? [] : Object.create(null)
  const data = Object.keys(val)
  data.forEach(item => {
    const value = val[item]
    if (value || value === 0) {
      res[item] = Array.isArray(value) ? compactObj(value) : value
    }
  })
  return res
}

export {
  compactObj
}
