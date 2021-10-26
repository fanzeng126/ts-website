import { paste } from '../../../utils/paste'

export default {
  data () {
    return {
      pasteColumns: [
        { fieldName: 'slump', dataType: 'text', decimal: 2 },
        { fieldName: 'concreteType', dataType: 'text', decimal: 2 },
        { fieldName: 'cement', dataType: 'number', decimal: 2 },
        { fieldName: 'flyAsh', dataType: 'number', decimal: 2 },
        { fieldName: 'coarseAggregateLevel1', dataType: 'number', decimal: 2 },
        { fieldName: 'coarseAggregateLevel2', dataType: 'number', decimal: 2 },
        { fieldName: 'coarseAggregateLevel3', dataType: 'number', decimal: 2 },
        { fieldName: 'fineAggregate', dataType: 'number', decimal: 2 },
        { fieldName: 'waterReducer', dataType: 'number', decimal: 2 },
        { fieldName: 'remark', dataType: 'text', decimal: 2 }
      ]
    }
  },
  computed: {
    columns () {
      return [
        {
          type: 'checkBox',
          headerReadonly: rec => !this.isEdit,
          width: 48,
          minWidth: 48,
          disabled: true,
          readonly: rec => !this.isEdit,
          headerStyle: rec => {
            return { uncheckBgColor: this.isEdit ? '#FFF' : '#EAEAEA' }
          }
        },
        {
          field: '',
          columnType: new kakaGrid.columns.type.Column({
            convert: (value, displayValue, cell, grid) => {
              return cell.row - grid.frozenRowCount + 1
            }
          }),
          caption: '序号',
          align: 'center',
          width: 50,
          minWidth: 50,
          readonly: true
        },
        {
          field: 'specModel',
          caption: '设计等级',
          align: 'center',
          width: 100,
          readonly: true
        },
        {
          field: 'slump',
          caption: '坍塌度(mm)',
          type: 'text',
          align: 'center',
          width: 150,
          style: {
            textOverflow: 'ellipsis'
          },
          readonly: rec => !this.isEdit
        },
        {
          field: 'concreteType',
          type: 'text',
          caption: '混凝土种类',
          align: 'center',
          width: 200,
          style: {
            textOverflow: 'ellipsis'
          },
          readonly: rec => !this.isEdit
        },
        {
          field: 'cement',
          caption: '水泥(kg)',
          align: 'center',
          type: 'number',
          width: 150,
          readonly: rec => !this.isEdit
        },
        {
          field: 'flyAsh',
          caption: '粉煤灰(kg)',
          align: 'center',
          type: 'number',
          width: 150,
          readonly: rec => !this.isEdit
        },
        {
          caption: '粗集料(kg)',
          columns: [
            { field: 'coarseAggregateLevel1', type: 'number', caption: '5-10mm', align: 'center', minWidth: 80, readonly: rec => !this.isEdit },
            { field: 'coarseAggregateLevel2', type: 'number', caption: '10-20mm', align: 'center', minWidth: 80, readonly: rec => !this.isEdit },
            { field: 'coarseAggregateLevel3', type: 'number', caption: '16-31.05mm', align: 'center', minWidth: 80, readonly: rec => !this.isEdit }
          ]
        },
        {
          caption: '细集料(kg)',
          columns: [
            { field: 'fineAggregate', type: 'number', caption: '0-5mm', align: 'center', minWidth: 80, readonly: rec => !this.isEdit }
          ]
        },
        {
          field: 'waterReducer',
          caption: '减水剂(kg)',
          align: 'center',
          type: 'number',
          width: 100,
          readonly: rec => !this.isEdit
        },
        {
          field: 'remark',
          type: 'text',
          caption: '备注',
          width: 'auto',
          align: 'center',
          style: {
            textOverflow: 'ellipsis'
          },
          readonly: rec => !this.isEdit
        }
      ]
    }
  },
  methods: {
    selectCell (obj, selected, vm) {
      const { row } = obj
      if (selected) {
        this.activeRecord = vm.kakaGrid.getRowRecord(row)
        vm.invalidate()
      }
    },
    gridChange (data, vm) {
      const { field, record, value, oldValue } = data
      if (field !== '_selected' && value !== oldValue) {
        record.isModify = true
      }
    },
    selectItems (data, vm) {
      this.selectedList = this.records.filter(item => item._selected)
    },
    selectAllItems (data) {
      this.selectedList = this.records.filter(item => item._selected)
    },
    load (vm) {
      this.$nextTick(() => {
        vm.invalidate()
      })
    },
    pasteData (data) {
      const grid = this.$refs.mixRecordGrid.kakaGrid
      const row = grid.selection.range.start.row

      if (!this.isEdit || row < 2) {
        return
      }
      const res = paste(
        data,
        grid,
        this.pasteColumns,
        3
      )
      res.forEach((v, k) => {
        const rec = grid.getRowRecord(row + k)
        if (rec) {
          Object.assign(rec, v, { isModify: true })
        }
      })

      this.$nextTick(() => grid.invalidate())
    }
  }
}
