import { transformData } from './transform-data'

/**
 * header demo {
 *  ...,
 *  fieldName: string, 列键名,必填
 *  dataType: string, 数据类型,必填
 *  decimal: number, 小数精度, number类型必填
 *  formula: function, 列计算公式,选填
 *  retainNull: number 类型是否返回null值
 * }
 */

/**
  * grid 实现 excel 粘贴复制
  * @param {string} data 复制内容
  * @param {object} grid grid实例化对象
  * @param {array} header grid header
  */
function paste (data, grid, header, splitCol) {
  const dataColumns = (data || '').split(/\r\n|\r|\n/)
  if (/(\r\n|\r|\n)$/.test(data)) {
    dataColumns.pop()
  }

  const headerMap = {} // 按照列键名存储对象
  header.forEach(ele => {
    headerMap[ele.fieldName] = ele
  })

  const startCol = grid.selection.range.start.col < splitCol
    ? 0
    : grid.selection.range.start.col - splitCol // 获取焦点最小列
  const startRow = grid.selection.range.start.row

  const keyArray = Object.keys(headerMap) // 列表的key
  const pasteInfo = dataColumns.map((item, index) => {
    const itemPasteInfos = item.split('\t') // 制表符切割
    const formattedResult = {}

    itemPasteInfos.forEach((value, itemIndex) => { // 按照复制顺序，从焦点单元格开始对应粘贴
      const column = headerMap[keyArray[startCol + itemIndex]]
      if (
        startCol + itemIndex < keyArray.length
      ) {
        formattedResult[keyArray[startCol + itemIndex]] =
          transformData(
            column.dataType,
            value,
            column.decimal,
            column.retainNull
          )
      }
    })

    return formattedResult
  })

  const items = [] // 需要计算的属性
  header.forEach(ele => {
    if (typeof ele.formula === 'function') {
      items.push({
        field: ele.fieldName,
        formula: ele.formula
      })
    }
  })

  pasteInfo.forEach((item, index) => { // 添加计算属性
    const record = grid.getRowRecord(startRow + index) || {}
    const newRecord = Object.assign({}, record, item)
    items.forEach(ele => {
      item[ele.field] = ele.formula && ele.formula(newRecord)
    }) // 注释代码的逻辑不会影响原来grid数据
    // const record = grid.getRowRecord(startRow + index)
    // if (record) Object.assign(record, item)
    // items.forEach(ele => {
    //   item[ele.field] = ele.formula && ele.formula(record || item)
    // })
  })

  return pasteInfo
}

export {
  paste
}
