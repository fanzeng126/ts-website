function FROZEN_ROWS_BORDER_COLOR (args) {
  const { row, grid: { frozenRowCount } } = args
  if (frozenRowCount - 1 === row) {
    return ['#E8E8E8', '#E8E8E8', '#E8E8E8', '#E8E8E8']
  } else {
    return ['#E8E8E8']
  }
}
function BORDER_COLOR (args) {
  const { col, grid: { colCount, frozenColCount } } = args
  if (frozenColCount - 1 === col) {
    return ['#E8E8E8', '#E8E8E8', '#E8E8E8', '#E8E8E8']
  } else if (colCount - 1 === col) {
    return ['#E8E8E8', '#E8E8E8', '#E8E8E8', '#E8E8E8']
  } else {
    return ['#E8E8E8', '#E8E8E8']
  }
}
const userTheme = {
  frozenRowsBgColor: '#FAFAFA',
  frozenRowsBorderColor: FROZEN_ROWS_BORDER_COLOR,
  frozenRowsColor: '#595959',
  borderColor: BORDER_COLOR,
  // selectionBgColor: 'rgba(94, 158, 214, 0.5)',
  selectionBgColor: '#F4FBFF',
  highlightBorderColor: '#5E9ED6',
  defaultRowHeight: 40,
  font: '12px Arial,"PingFang SC","Microsoft YaHei","微软雅黑","黑体","宋体",sans-serif'
}

export default userTheme
