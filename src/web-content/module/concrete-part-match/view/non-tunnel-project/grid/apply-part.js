import userTheme from '../../../../../utils/grid-theme.js'
export default {
  data () {
    return {
      applyPartGrid: null
    }
  },
  computed: {
  },
  watch: {
    applyPartList (newValue) {
      if (newValue) {
        this.applyPartGrid.records = newValue
        this.selectedList = []
        this.applyPartGrid.headerValues.set('check', false)
        this.applyPartGrid.invalidate()
      }
    }
  },
  mounted () {
    this.initApplyPartGrid()
  },
  methods: {
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
        parentElement: document.querySelector('#applyPart'),
        header: [
          {
            field: 'check',
            caption: '',
            width: '5%',
            columnType: 'check',
            action: 'check',
            headerType: 'check',
            headerAction: 'check',
            headerStyle: {
              checkBgColor: '#008CD6',
              color: '#fff'
            },
            style: (rec) => {
              return {
                checkBgColor: '#008CD6',
                color: '#fff'
              }
            }
          },
          {
            field: 'isRelated',
            caption: 'ε³θηΆζ',
            width: '10%',
            headerStyle,
            style: (rec) => {
              return {
                textAlign: 'center',
                color: rec.isRelated ? '#1FBF6A' : '#F4AF61'
              }
            },
            columnType: new window.kakaGrid.columns.type.DrawColumn({
              draw: function (value, ctx, opt) {
                ctx.save()
                try {
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
                  ctx.fillStyle = fillStyleMap[value]
                  ctx.strokeStyle = strokeStyleMap[value]
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

                  ctx.fillStyle = strokeStyleMap[value]
                  ctx.fillText(value ? 'ε·²ε³θ' : 'ζͺε³θ', left + padding[3], top + padding[0])

                  ctx.stroke()
                } finally {
                  ctx.restore()
                }
              }
            })
          },
          {
            field: 'partName',
            caption: 'η³θ―·ι¨δ½',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }
          },
          {
            field: 'projectUnitWorkName',
            caption: 'εδ½ε·₯η¨',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }
          },
          {
            field: 'entryWorkName',
            caption: 'ει‘Ήε·₯η¨',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'center'
            }
          },
          {
            field: 'specModel',
            caption: 'ζ ε·',
            width: '10%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'requiredTime',
            caption: 'η³θ―·ιη¨ζΆι΄',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'creator',
            caption: 'η³θ―·δΊΊ',
            width: '10%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'teamName',
            caption: 'ζ½ε·₯ιδΌ',
            width: '10%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center',
              textOverflow: 'ellipsis'
            }
          },
          {
            field: 'remark',
            caption: 'ε€ζ³¨',
            width: 'auto',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center',
              textOverflow: 'ellipsis'
            }
          }
        ]
      })

      // θ‘¨ε€΄checkηΉε»δΊδ»Ά
      this.applyPartGrid.listen(window.kakaGrid.ListGrid.EVENT_TYPE.CHANGED_HEADER_VALUE, data => {
        if (data.field !== 'check') {
          return
        }
        this.applyPartGrid.records.forEach((item, index) => {
          item[data.field] = data.value
        })
        this.applyPartGrid.invalidate()
        this.selectedList = this.applyPartGrid.records.filter(item => item.check)
      })
      // θ‘checkηΉε»δΊδ»Ά
      this.applyPartGrid.listen(window.kakaGrid.ListGrid.EVENT_TYPE.CHANGED_VALUE, data => {
        if (data.field !== 'check') {
          return
        }
        const selectedLength = this.applyPartGrid.records.filter(item => item.check).length
        if (selectedLength === this.applyPartGrid.records.length) {
          this.applyPartGrid.headerValues.set('check', true)
        } else this.applyPartGrid.headerValues.set('check', false)
        this.applyPartGrid.invalidate()
        this.selectedList = this.applyPartGrid.records.filter(item => item.check)
      })
    }
  }
}
