import cloneDeep from 'lodash.clonedeep'
import round from 'lodash.round'
import userTheme from '@utils/grid-theme.js'

const headerStyle = { textAlign: 'center' }

export default {
  data () {
    return {
      analysisRecords: [],
      analysisColumns: [],
      copyAnalysisRecords: []
    }
  },
  computed: {
    originColumns () {
      return [
        {
          field: 'materialName',
          caption: '物资名称',
          width: 60,
          columnType: 'text',
          style: {
            padding: 4
          }
        },
        {
          field: 'materialSpecModel',
          caption: '规格型号',
          headerStyle,
          columnType: new kakaGrid.columns.type.Column({
            cellStyle: () => {
              return { innerBox: this.isEdit ? 'dashed' : '' }
            }
          }),
          width: 60,
          style: {
            textOverflow: 'ellipsis',
            textAlign: 'center'
          },
          action: new kakaGrid.columns.action.InlineInputEditor({
            disabled: rec => !this.isEdit
          })
        },
        {
          field: 'unit',
          type: 'text',
          caption: '单位',
          headerStyle,
          style: {
            textAlign: 'center'
          },
          width: 50
        },
        {
          caption: '本期',
          headerStyle,
          columns: [
            {
              field: 'periodDesignQuantity',
              caption: '设计量',
              headerStyle,
              style: {
                appearance: {
                  color: '#1296db',
                  path: 'M4.7997924,9.6 C2.15326327,9.6 0,7.44655046 0,4.79937714 C0,2.15261906 2.15326327,0 4.7997924,0 C7.44673673,0 9.6,2.15261906 9.6,4.79937714 C9.6,7.44655046 7.44673673,9.6 4.7997924,9.6 Z M4.79959481,0.9 C2.64922597,0.9 0.9,2.64900249 0.9,4.79918953 C0.9,6.95018703 2.64922597,8.7 4.79959481,8.7 C6.95036883,8.7 8.7,6.95018703 8.7,4.79918953 C8.7,2.64940773 6.95036883,0.9 4.79959481,0.9 Z M11.579002,12 C11.4749824,12 11.3709629,11.9593028 11.289322,11.8774707 L7.93168591,8.56830498 C7.76260228,8.39851441 7.75555713,8.11713467 7.91510908,7.93902961 C8.07631871,7.76136216 8.34237677,7.75261007 8.51104597,7.92065022 L11.8686821,11.2315664 C12.0373513,11.4004817 12.0443964,11.6822991 11.8848445,11.8608417 C11.8019603,11.9527387 11.6904812,12 11.579002,12 Z',
                  width: 12
                },
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                },
                readonly: true
              }),
              action: new kakaGrid.columns.action.InlineInputEditor({
                action: (rec, info) => {
                  this.oldQuantity = (this.analysisRecords.map(l => l.periodDesignQuantity).reduce((x, y) => x + y)) / 5
                  this.showDetailDlg = true
                },
                disableInput: true
              })
            },
            {
              field: 'periodCheckActualQuantity',
              caption: '盘点实耗量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : round(value, 2)
                },
                cellStyle: () => {
                  return { innerBox: this.isEdit ? 'dashed' : '' }
                }
              }),
              action: new kakaGrid.columns.action.InlineInputEditor({
                type: 'number',
                disabled: rec => !this.isEdit
              })
            },
            {
              field: 'periodCheckSubQuantity',
              caption: '盘点节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.periodCheckSubQuantity)
            },
            {
              field: 'periodCheckSubRatio',
              caption: '盘点节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.periodCheckSubRatio)
            },
            {
              field: 'periodProduceActualQuantity',
              caption: '机楼实耗量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : round(value, 2)
                }
              })
            },
            {
              field: 'periodProduceSubQuantity',
              caption: '机楼配比节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.periodProduceSubQuantity)
            },
            {
              field: 'periodProduceSubRatio',
              caption: '机楼节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return value === null ? null : `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.periodProduceSubRatio)
            }
          ]
        },
        {
          caption: '本年',
          headerStyle,
          columns: [
            {
              field: 'yearDesignQuantity',
              style: {
                textAlign: 'center'
              },
              caption: '设计量',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'yearCheckActualQuantity',
              style: {
                textAlign: 'center'
              },
              caption: '盘点实耗量',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'yearCheckSubQuantity',
              caption: '盘点节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.yearCheckSubQuantity)
            },
            {
              field: 'yearCheckSubRatio',
              caption: '盘点节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.yearCheckSubRatio)
            },
            {
              field: 'yearProduceActualQuantity',
              caption: '机楼实耗量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'yearProduceSubQuantity',
              caption: '机楼配比节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.yearProduceSubQuantity)
            },
            {
              field: 'yearProduceSubRatio',
              type: 'number',
              caption: '机楼节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.yearProduceSubRatio)
            }
          ]
        },
        {
          caption: '开累',
          headerStyle,
          columns: [
            {
              field: 'totalDesignQuantity',
              caption: '设计量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'totalCheckActualQuantity',
              caption: '盘点实耗量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'totalCheckSubQuantity',
              caption: '盘点节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.totalCheckSubQuantity)
            },
            {
              field: 'totalCheckSubRatio',
              caption: '盘点节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.totalCheckSubRatio)
            },
            {
              field: 'totalProduceActualQuantity',
              caption: '机楼实耗量',
              headerStyle,
              style: {
                textAlign: 'center'
              },
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              })
            },
            {
              field: 'totalProduceSubQuantity',
              caption: '机楼配比节超',
              headerStyle,
              columnType: new kakaGrid.columns.type.NumberColumn({
                convert: (value, displayValue, cell, grid) => {
                  return round(value, 2)
                }
              }),
              style: rec => this.setStyle(rec.totalProduceSubQuantity)
            },
            {
              field: 'totalProduceSubRatio',
              caption: '机楼节超率',
              headerStyle,
              columnType: new kakaGrid.columns.type.MultilineTextColumn({
                convert: (value, displayValue, cell, grid) => {
                  return `${round(value, 2)}%`
                }
              }),
              style: rec => this.setStyle(rec.totalProduceSubRatio)
            }
          ]
        },
        {
          field: 'remark',
          caption: '备注',
          width: 100,
          headerStyle,
          style: {
            textOverflow: 'ellipsis'
          },
          columnType: new kakaGrid.columns.type.Column({
            cellStyle: () => {
              return { innerBox: this.isEdit ? 'dashed' : '' }
            }
          }),
          action: new kakaGrid.columns.action.InlineInputEditor({
            disabled: rec => !this.isEdit
          })
        }
      ]
    }
  },
  watch: {
    analysisRecords (newValue) {
      if (newValue) {
        this.analysisGrid.records = newValue
        this.analysisGrid.invalidate()
      }
    }
  },
  mounted () {
    this.initGrid()
  },
  methods: {
    initGrid () {
      this.changeInventor(true, false)

      this.analysisGrid = new window.kakaGrid.ListGrid({
        theme: Object.assign({}, userTheme, {
          highlightBorderColor: 'transparent'
        }),
        parentElement: document.querySelector('#analysisGrid'),
        header: this.analysisColumns,
        frozenColCount: 3
      })

      this.analysisGrid.addEventListener(kakaGrid.ListGrid.EVENT_TYPE.CHANGED_VALUE, (data) => {
        const { record, value, oldValue, field } = data
        if (value !== oldValue) {
          record.isModify = true
          if (field === 'periodCheckActualQuantity') {
            record.yearCheckActualQuantity = value - oldValue + record.yearCheckActualQuantity
            record.totalCheckActualQuantity = value - oldValue + record.totalCheckActualQuantity
            this._calcRatio(record, 'period')
            this._calcRatio(record, 'year')
            this._calcRatio(record, 'total')
            this.analysisGrid.invalidate()
          }
        }
      })
    },
    changeInventor (value) {
      this.analysisColumns = this.getColumns(this.inventorActual, this.machineActual)
      if (this.analysisGrid) {
        this.analysisGrid.header = this.analysisColumns
        this.analysisGrid.invalidate()
      }
    },
    changeMachine (value) {
      this.analysisColumns = this.getColumns(this.inventorActual, this.machineActual)
      if (this.analysisGrid) {
        this.analysisGrid.header = this.analysisColumns
        this.analysisGrid.invalidate()
      }
    },
    setStyle (val) {
      return { color: val < 0 ? 'red' : '#333', textAlign: 'center' }
    },
    getColumns (inventor, machine) {
      const temp = cloneDeep(this.originColumns)
      if (inventor && !machine) {
        temp.map(m => {
          if (m.columns) {
            m.columns = m.columns.filter(l => {
              return l.caption.includes('盘点') || l.caption.includes('设计量')
            })
          }
          return m
        })
      }
      if (!inventor && machine) {
        temp.map(m => {
          if (m.columns) {
            m.columns = m.columns.filter(l => {
              return l.caption.includes('机楼') || l.caption.includes('设计量')
            })
          }
          return m
        })
      }
      if (!inventor && !machine) {
        temp.map(m => {
          if (m.columns) {
            m.columns = m.columns.filter(l => {
              return l.caption.includes('设计量')
            })
          }
          return m
        })
      }
      return temp
    }
  }
}
