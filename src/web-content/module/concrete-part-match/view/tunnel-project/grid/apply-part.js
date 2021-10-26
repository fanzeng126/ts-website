import userTheme from '../../../../../utils/grid-theme.js'
import round from 'lodash.round'
export default {
  data () {
    return {
      applyPartGrid: null,
      selectApplyItem: {}
    }
  },
  computed: {
  },
  watch: {
    tunnelApplyPartList (newValue) {
      this.setGridDataSource(newValue)
      this.selectApplyItem = undefined
      this.applyPartGrid.selectCellRange(-1, 0, -1, 0)
      this.applyPartGrid.invalidate()
    }
  },
  mounted () {
    this.initApplyPartGrid()
  },
  methods: {
    setGridDataSource (data) {
      const cachedDataSource = window.kakaGrid.data.CachedDataSource.ofArray(data)
      const treeDataSource = new window.kakaGrid.data.TreeDataSource(cachedDataSource, {
        keyField: 'id',
        parentKeyField: 'parentId'
      })
      this.applyPartGrid.dataSource = treeDataSource
      this.applyPartGrid.dataSource.expandAll()
      this.applyPartGrid.dataSource.refresh()
    },
    initApplyPartGrid () {
      if (this.applyPartGrid) {
        return
      }
      const headerStyle = { textAlign: 'center' }
      this.applyPartGrid = new window.kakaGrid.ListGrid({
        theme: Object.assign({},
          userTheme,
          {
            highlightBorderColor: 'transparent'
          }
        ),
        parentElement: document.querySelector('#applyGrid'),
        header: [
          {
            field: 'name',
            caption: '单位工程/隧道里程',
            width: 'auto',
            columnType: 'tree',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'left',
              padding: [0, 0, 0, -12]
            }
          },
          {
            field: 'linearMeter',
            caption: '延长米',
            width: '12%',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            },
            columnType: new window.kakaGrid.columns.type.Column({
              convert: (value, displayValue, cell, grid) => {
                const item = grid.getRowRecord(cell.row)
                if (item.isLeaf) {
                  return ''
                } else {
                  if (value) {
                    return round(value, 2)
                  }
                }
              }
            })
          },
          {
            field: 'rockGradeName',
            caption: '围岩等级/砌衬类型',
            width: '20%',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'specModel',
            caption: '材料标号',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'requiredTime',
            caption: '申请需用时间',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'teamName',
            caption: '施工队伍',
            width: '18%',
            headerStyle,
            style: {
              textAlign: 'center',
              textOverflow: 'ellipsis'
            },
            columnType: new window.kakaGrid.columns.type.Column({
              convert: (value, displayValue, cell, grid) => {
                const item = grid.getRowRecord(cell.row)
                if (item.isLeaf) {
                  return ''
                } else {
                  return value
                }
              }
            })
          }
        ]
      })

      this.applyPartGrid.addEventListener(window.kakaGrid.ListGrid.EVENT_TYPE.SELECTED_CELL, (data, selected) => {
        const selectedRow = this.applyPartGrid.getRowRecord(data.row)
        if (selectedRow && selectedRow.isLeaf) {
          this.selectApplyItem = selectedRow
          this.applyPartGrid.selectCellRange(-1, data.row, this.applyPartGrid.colCount - 1, data.row)
        }
      })
    }
  }
}
