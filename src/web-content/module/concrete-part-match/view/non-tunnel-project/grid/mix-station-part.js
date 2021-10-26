import userTheme from '../../../../../utils/grid-theme.js'
export default {
  data () {
    return {
      mixPartGrid: null
    }
  },
  watch: {
    mixStationPartList (newValue) {
      if (newValue) {
        this.mixPartGrid.records = newValue
        this.mixPartGrid.invalidate()
      }
    }
  },
  mounted () {
    this.initMixPartGrid()
  },
  methods: {
    initMixPartGrid () {
      if (this.mixPartGrid) {
        return
      }
      const headerStyle = { textAlign: 'center' }
      this.mixPartGrid = new window.kakaGrid.ListGrid({
        theme: Object.assign({},
          userTheme,
          {
            highlightBorderColor: 'transparent'
          }
        ),
        parentElement: document.querySelector('#mixStationPart'),
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
            field: 'produceTime',
            caption: '发料时间',
            width: '12%',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'isRelated',
            caption: '关联状态',
            width: '12%',
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
                  ctx.fillText(value ? '已关联' : '未关联', left + padding[3], top + padding[0])

                  ctx.stroke()
                } finally {
                  ctx.restore()
                }
              }
            })
          },
          {
            field: 'partName',
            caption: '拌合站机楼部位',
            width: 'auto',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          },
          {
            field: 'strength',
            caption: '标号',
            width: '12%',
            columnType: 'text',
            headerStyle,
            style: {
              textAlign: 'center'
            }
          }
        ]
      })
      // 表头check点击事件
      this.mixPartGrid.listen(window.kakaGrid.ListGrid.EVENT_TYPE.CHANGED_HEADER_VALUE, data => {
        if (data.field !== 'check') {
          return
        }
        this.mixPartGrid.records.forEach((item, index) => {
          item[data.field] = data.value
        })
        const records = this.mixPartGrid.records
        this.checkArr = records.filter(item => item.check)
        this.mixPartGrid.invalidate()
      })
      // 行check点击事件
      this.mixPartGrid.listen(window.kakaGrid.ListGrid.EVENT_TYPE.CHANGED_VALUE, data => {
        if (data.field !== 'check') {
          return
        }
        const records = this.mixPartGrid.records
        this.checkArr = records.filter(item => item.check)
        if (this.checkArr.length === records.length) {
          this.mixPartGrid.headerValues.set('check', true)
        } else this.mixPartGrid.headerValues.set('check', false)
        this.mixPartGrid.invalidate()
      })
    }
  }
}
