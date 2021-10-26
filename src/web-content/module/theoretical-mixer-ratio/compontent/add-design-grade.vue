<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    width="438px"
    height="454px"
    class="designGrade"
    :draggable="true"
    title="新增设计等级"
    :buttons="buttons"
    @change="change"
    @show="openDlg"
    @buttonclick="onButtonClick">
    <mu-bar class="mu-bar-pad" border-bottom>
      <mu-search-box
        ref="search"
        v-model="searchValue"
        style="width: 100%;"
        placeholder="按混凝土标号模糊搜索"
        @search="onSearch"
        @change="onSearch" />
    </mu-bar>
    <mu-v-box class="grid">
      <kaka-grid
        ref="gradeGrid"
        class="mu-absolute-fit"
        :columns="columns"
        :records="records"
        :theme="{highlightBorderColor: 'transparent'}" />
    </mu-v-box>
  </mu-dialog>
</template>

<script>
  import { notify } from '@mctech/mussel'

  const SUFFIX_PENGSHE = '喷射'
  const SUFFIX_SHUIXIA = '水下'
  const SUFFIX_KANGSHEN = '抗渗'
  const SUFFIX_XISHI = '细石'
  const SUFFIX_SHAJIANG = '砂浆'

  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: Boolean,
      spceModel: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        searchValue: '',
        records: [],
        copyRecords: [],
        buttons: [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ]
      }
    },
    computed: {
      columns () {
        return [
          {
            field: '_selected',
            type: 'checkBox',
            width: 50,
            readonly: rec => rec.isChecked,
            style: (rec) => {
              return rec.isChecked ? { checkBgColor: '#999', borderColor: '#999' } : {}
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
            minWidth: 50
          },
          { field: 'name', caption: '混凝土标号', align: 'center', width: 'auto', minWidth: 150 }
        ]
      }
    },
    methods: {
      change (value) {
        this.$emit('change', value)
      },
      openDlg () {
        this.records = []
        for (let i = 10; i <= 90; i++) {
          if (i % 5 === 0) {
            this.records.push({
              name: `C${i}`,
              isChecked: this.spceModel.includes(`C${i}`),
              _selected: this.spceModel.includes(`C${i}`)
            })
          }
        }
        let specialModel = ['C20' + SUFFIX_PENGSHE, 'C25' + SUFFIX_PENGSHE, 'C30' + SUFFIX_SHUIXIA, 'C30' + SUFFIX_KANGSHEN,
                            'C30' + SUFFIX_PENGSHE, 'C35' + SUFFIX_SHUIXIA, 'C35' + SUFFIX_KANGSHEN,
                            'C40' + SUFFIX_XISHI, 'C40' + SUFFIX_SHUIXIA, 'C45' + SUFFIX_SHUIXIA, SUFFIX_SHAJIANG]
        specialModel = specialModel.map(m => {
          return {
            name: m,
            isChecked: this.spceModel.includes(m),
            _selected: this.spceModel.includes(m)
          }
        })

        this.records = this.records.concat(specialModel)
        this.copyRecords = [...this.records]
      },
      onButtonClick ({ key }) {
        const vm = this.$refs.gradeGrid

        if (key === 'ok') {
          const models = vm.getSelectedRecords()
          if (models && models.length === 0) {
            notify('warning', '请先选择设计等级')
            return
          }
          this.$emit('success', models)
        }
        this.change(false)
      },
      onSearch (value) {
        if (value) {
          this.records = this.copyRecords.filter(l => {
            return l.name.includes(value)
          })
        } else {
          this.records = this.copyRecords
        }
      }
    }
  }
</script>
<style lang="postcss" scoped>
  .designGrade {
    .mu-dialog-body {
      padding: 0;
    }
    .mu-dialog-footer {
      border-top: 1px solid #ebecf0;
    }
    .grid {
      width: calc(100% - 32px);
      height: calc(100% - 82px);
      margin: 16px auto;
    }
  }
</style>
