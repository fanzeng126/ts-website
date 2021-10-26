import userTheme from '../../../../../utils/grid-theme.js'
export default {
  data () {
    return {
      wbsGrid: null,
      selectWbsItem: null,
      cancelPartId: null
    }
  },
  computed: {
  },
  watch: {
    sqPartList (newValue) {
      if (newValue) {
        this.wbsGrid.records = newValue
        this.selectWbsItem = {}
        this.wbsGrid.selectCellRange(-1, 0, -1, 0)
        this.wbsGrid.invalidate()
      }
    }
  },
  mounted () {
    this.initWbsGrid()
  },
  methods: {
    initWbsGrid () {
      if (this.wbsGrid) {
        return
      }
      const headerStyle = { textAlign: 'center' }
      this.wbsGrid = new window.kakaGrid.ListGrid({
        theme: Object.assign({},
          userTheme, {
            highlightBorderColor: 'transparent'
          }
        ),
        parentElement: document.querySelector('#wbsGrid'),
        header: [
          {
            field: 'partName',
            caption: '算量部位',
            width: '20%',
            headerStyle: {
              padding: 10
            },
            style: (rec) => {
              return {
                bgColor: this.selectWbsItem && this.selectWbsItem.idKey === rec.idKey ? '#f4fbff' : '#fff',
                color: rec.partType === 1 ? '#008CD6' : '#333',
                padding: 10,
                textOverflow: 'ellipsis',
                appearance: () => {
                  if (rec.partType === 1) {
                    return {
                      path: 'M0 2 5 7 10 2z',
                      width: 12,
                      color: '#000'
                    }
                  } else {
                    return ''
                  }
                }
              }
            },
            columnType: new kakaGrid.columns.type.MultilineTextColumn({
              convert: (value, displayValue, cell, grid) => {
                const { startPile = '', endPile = '' } = grid.getRowRecord(cell.row)
                let pileStr
                if (startPile && endPile) {
                  pileStr = `(${startPile}~${endPile})`
                } else if (startPile || endPile) {
                  pileStr = `(${startPile || endPile})`
                } else {
                  pileStr = ''
                }
                return `${displayValue}${pileStr}`
              }
            }),
            action: new window.kakaGrid.columns.action.InlineTextAreaEditor({
              disabled: rec => rec.partType === 0,
              disableInput: true,
              action: (rec, info) => {
                this.cancelPartId = rec.partId
                const scrollTop = event.target.scrollTop
                this.showCancelPart = true
                this.$refs.hiddenInput.focus()
                this.$refs.cancelPart.style.top = (info.cell.row + 1) * 40 - scrollTop + 'px'
              }
            })
          },
          {
            field: 'isRelated',
            caption: '部位类型',
            width: '16%',
            columnType: new window.kakaGrid.columns.type.DrawColumn({
              draw: function (value, ctx, opt) {
                ctx.save()
                try {
                  const isMatch = value
                  const fillStyleMap = {
                    true: '#D5FFE8',
                    false: '#FFF5E9'
                  }

                  const strokeStyleMap = {
                    true: '#1FBF6A',
                    false: '#F4AF61'
                  }

                  const valueHeight = 12
                  const valueWidth = 41
                  const padding = [6, 6, 4, 8]
                  const radius = 2
                  const h = valueHeight + padding[0] + padding[2]
                  const w = valueWidth + padding[1] + padding[3]
                  const x = (opt.rect.width - w) / 2
                  const y = (opt.rect.height - h) / 2

                  const left = opt.rect.left + x
                  const top = opt.rect.top + y
                  const width = w
                  const height = h
                  ctx.lineWidth = 1
                  ctx.fillStyle = fillStyleMap[isMatch]
                  ctx.strokeStyle = strokeStyleMap[isMatch]
                  ctx.beginPath()
                  ctx.arc(left + radius, top + radius, radius, -Math.PI, -0.5 * Math.PI, false)
                  ctx.arc(left + width - radius, top + radius, radius, -0.5 * Math.PI, 0, false)
                  ctx.arc(
                    left + width - radius,
                    top + height - radius,
                    radius,
                    0,
                    0.5 * Math.PI,
                    false
                  )
                  ctx.arc(left + radius, top + height - radius, radius, 0.5 * Math.PI, Math.PI, false)
                  ctx.closePath()
                  ctx.fill()

                  ctx.fillStyle = strokeStyleMap[isMatch]
                  ctx.fillText(value ? '已施工' : '未施工', left + padding[3], top + padding[0])

                  ctx.stroke()
                } finally {
                  ctx.restore()
                }
              }
            }),
            headerStyle,
            style: (rec) => {
              return {
                textAlign: 'center',
                color: rec.partType === 1 || rec.applicationCount > 0 ? '#1FBF6A' : '#F4AF61'
              }
            }
          },
          {
            field: 'projectUnitWorkName',
            caption: '单位工程',
            width: '16%',
            columnType: 'text',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }
          },
          {
            field: 'entryWorkName',
            caption: '分项工程',
            width: '16%',
            columnType: 'text',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }
          },
          {
            field: 'specModel',
            caption: '标号',
            width: '16%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'requiredTime',
            caption: '申请需用时间',
            width: '16%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          }
        ]
      })
      this.wbsGrid.addEventListener(window.kakaGrid.ListGrid.EVENT_TYPE.SELECTED_CELL, (data, selected) => {
        if (data.selected) {
          this.selectWbsItem = undefined
          const selectedItem = this.wbsGrid.getRowRecord(data.row)
          if (this.activeTabName === '申请部位' && selectedItem?.partType === 1) {
            return
          }
          if (data.row > 0) {
            this.selectWbsItem = selectedItem
            this.wbsGrid.selectCellRange(0, data.row, this.wbsGrid.colCount - 1, data.row)
          }
        }
      })
    },
    blurInput () {
      this.showCancelPart = false
    },
    async cancelNewSetPart () {
      const result = await this.applyPartCancelAdd({ partId: this.cancelPartId })
      if (result) {
        this.querySqPartList(this.setParams())
        if (this.activeTabName === '申请部位') {
          this.$refs.appPart.queryApplyPartFunc()
        }
      }
    }
  }
}
