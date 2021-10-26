import userTheme from '@utils/grid-theme.js'
import { warn, notify } from '@mctech/mussel'
export default {
  data () {
    return {
      configListGridGrid: null
    }
  },
  computed: {},
  watch: {
    configList (newValue) {
      if (newValue) {
        this.configListGrid.records = newValue
        this.configListGrid.invalidate()
      }
    }
  },
  mounted () {
    this.initGrid()
  },
  methods: {
    initGrid () {
      if (this.configListGrid) {
        return
      }
      const headerStyle = { textAlign: 'center' }
      this.configListGrid = new window.kakaGrid.ListGrid({
        theme: Object.assign({}, userTheme, {
          highlightBorderColor: 'transparent'
        }),
        parentElement: document.querySelector('#config-list'),
        header: [
          {
            field: 'orderNo',
            caption: '序号',
            width: '6%',
            headerStyle,
            style: {
              textAlign: 'center'
            },
            columnType: 'text'
          },
          {
            field: 'mixerNoLabel',
            caption: '机组编号',
            width: '20%',
            columnType: 'text',
            headerStyle: {
              textAlign: 'left'
            },
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'left'
            }
          },
          {
            field: 'mixerSystem',
            caption: '系统',
            width: 'auto',
            columnType: 'text',
            headerStyle: {
              textAlign: 'left'
            },
            style: {
              textOverflow: 'ellipsis',
              textAlign: 'left'
            }
          },
          {
            field: (rec) => rec.isIssue ? '是' : '否',
            caption: '是否主动下发',
            width: '8%',
            headerStyle: {
              textAlign: 'center'
            },
            style: (rec) => {
              return {
                color: rec.isIssue ? '#00b25a' : '#999',
                textAlign: 'center'
              }
            },
            columnType: new window.kakaGrid.columns.type.Column({
              linkButton: false
            })
          },
          {
            field: '',
            caption: '操作',
            colSpan: 2,
            style: rec => {
              return {
                color: '#008cd6',
                textAlign: 'center'
              }
            },
            headerStyle: {
              textAlign: 'center'
            },
            width: '6%',
            columnType: new window.kakaGrid.columns.type.ButtonColumn({
              linkButton: true,
              caption: '编辑'
            }),
            action: new window.kakaGrid.columns.action.ButtonAction({
              action: (rec, info) => {
                this.record = {
                  id: rec.id,
                  mixerNo: rec.mixerNo,
                  mixerSystem: rec.mixerSystem,
                  config: rec.config,
                  isIssue: rec.isIssue
                }
                this.visible = true
              }
            })
          },
          {
            headerStyle: {
              textAlign: 'center'
            },
            width: '6%',
            style: rec => {
              return {
                color: '#f57a79',
                textAlign: 'center'
              }
            },
            columnType: new window.kakaGrid.columns.type.ButtonColumn({
              linkButton: true,
              caption: '删除'
            }),
            action: new window.kakaGrid.columns.action.ButtonAction({
              action: rec => {
                warn('确定删除此条记录吗?', async btn => {
                  if (btn === 'ok') {
                    this.$http.delete(`services/mixer-station-config/${rec.id}`).then(res => {
                      if (res) {
                        notify('success', '删除成功')
                      }
                      this.queryData()
                    })
                  }
                })
              }
            })
          }
        ]
      })

      this.configListGrid.addEventListener(window.kakaGrid.ListGrid.EVENT_TYPE.SELECTED_CELL, (data, selected) => {
        this.configListGrid.selectCellRange(-1, data.row, this.configListGrid.colCount - 1, data.row)
      })
    }
  }
}
