<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    keep-alive
    width="425px"
    height="461px"
    :draggable="true"
    title="选择标号"
    :buttons="buttons"
    @change="change"
    @show="openDlg"
    @buttonclick="onButtonClick">
    <mu-v-box style="height:100%;">
      <kaka-grid
        ref="smGrid"
        class="mu-absolute-fit"
        :columns="columns"
        :records="records"
        :theme="{highlightBorderColor: 'transparent'}" />
    </mu-v-box>
  </mu-dialog>
</template>

<script>
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
        records: []
      }
    },

    computed: {
      buttons () {
        return [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ]
      },

      columns () {
        return [
          { type: 'checkBox', width: 50, readonly: rec => rec.isChecked },
          { field: 'name', caption: '混凝土标号', width: 'auto', minWidth: 150 }
        ]
      }
    },

    methods: {
      change (value) {
        this.$emit('change', value)
      },

      openDlg () {
        const spceModels = ['C20喷射', 'C25喷射', 'C30喷射', 'C30抗渗', 'C30水下', 'C35抗渗', 'C35水下', 'C40水下', 'C40细石', 'C45水下', '砂浆']

        for (let i = 15; i <= 90; i++) {
          if (i % 5 === 0) {
            spceModels.push(`C${i}`)
          }
        }

        spceModels.sort()

        const records = spceModels.map(v => {
          return { name: v, isChecked: this.spceModel.includes(v) }
        })

        this.records = records
      },

      onButtonClick ({ key }) {
        const vm = this.$refs.smGrid

        if (key === 'ok') {
          const models = vm.getSelectedRecords()
          this.$emit('success', models)
        }

        this.change(false)
        this.records.forEach(v => (v._selected = false))
        vm.kakaGrid.headerValues.set('_selected', false)
        vm.kakaGrid.invalidate()
      }
    }
  }
</script>
