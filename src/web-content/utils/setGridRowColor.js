function setBgColor ({ id, level = 1 }, selectRow = null) {
  const colorArr = ['#fff', '#FBFBFB', '#F1F2F4']
  if (id === selectRow?.id) {
    return {
      bgColor: '#e5f6ff'
      // color: 'rgba(0,140,214,1)'
    }
  } else {
    return {
      bgColor: level && colorArr[level - 1] ? colorArr[level - 1] : colorArr[2],
      color: 'rgba(0, 0, 0, 1)'
    }
  }
}

function handeleLevel (nodeItem, node) {
  const parentItem = node.find(v => v.id === nodeItem.parentId)
  if (nodeItem.parentId === -1) {
    nodeItem.level = 1
  } else if (!parentItem) {
    nodeItem.level = 1
  } else if (parentItem?.level) {
    nodeItem.level = parentItem.level + 1
  } else {
    const parent = handeleLevel(parentItem, node)
    nodeItem.level = parent.level + 1
  }
  return nodeItem
}

function setBorder (args) {
  if (args.grid.header.length <= 1) {
    return [null, null, '#EBECF0', null]
  }
  if (args.grid.colCount - 1 === args.col) {
    return ['#E8E8E8', null, '#E8E8E8', '#E8E8E8']
  } else if (args.col === 0) {
    return ['#E8E8E8', '#E8E8E8', '#E8E8E8', null]
  } else {
    return ['#E8E8E8', '#E8E8E8', '#E8E8E8', '#E8E8E8']
  }
}

function setBgColorRepeat ({ id, level = 1, isRepeat }, selectRow = null) {
  const colorArr = ['#fff', '#FBFBFB', '#F1F2F4']
  if (isRepeat) {
    return {
      bgColor: '#FFA9A6',
      color: '#000'

    }
  } else if (id === selectRow?.id) {
    return {
      bgColor: '#F4FBFF'
      // color: 'rgba(0,140,214,1)'
    }
  } else {
    return {
      bgColor: level && colorArr[level - 1] ? colorArr[level - 1] : colorArr[2],
      color: 'rgba(0, 0, 0, 1)'
    }
  }
}
export { handeleLevel, setBgColor, setBorder, setBgColorRepeat }
