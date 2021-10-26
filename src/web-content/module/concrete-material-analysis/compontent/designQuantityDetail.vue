<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    width="761px"
    height="570px"
    class="designQuantity"
    :draggable="true"
    title="查看明细"
    :buttons="buttons"
    @change="change"
    @show="openDlg"
    @buttonclick="onButtonClick">
    <mu-tabs-header
      v-model="activeTabHeaderName"
      :tab-items="tabItems"
      tab-style="card" />
    <mu-v-box class="grid">
      <kaka-grid
        ref="designQuantityGrid"
        style="height: 100%"
        :columns="columns"
        :records="records"
        :theme="{highlightBorderColor: 'transparent'}" />
    </mu-v-box>
  </mu-dialog>
</template>

<script>
  import cloneDeep from 'lodash.clonedeep'
  import { mapActions } from 'vuex'
  import designQuantityDetail from '../grid/designQuantityDetail'

  export default {
    mixins: [designQuantityDetail],
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: Boolean,
      id: Number,
      unit: String
    },
    data () {
      return {
        records: [],
        activeTabHeaderName: '计算明细',
        tabItems: [
          { name: '计算明细', label: '计算明细' },
          { name: '理论配合比', label: '理论配合比' }
        ],
        columns: []
      }
    },
    computed: {
      buttons () {
        return [
          { caption: '关闭', key: 'cancel' }
        ]
      }
    },
    watch: {
      async activeTabHeaderName (val) {
        let columns
        if (val === '计算明细') {
          columns = cloneDeep(this.originColumns)
          this.records = await this.getMaterialAnalyseDesignQuantity({ id: this.id })
        } else {
          columns = cloneDeep(this.theoreticalColumns)
          this.records = await this.getStatMixerRatio({ statId: this.id })
        }
        this.$nextTick(() => {
          this.$refs.designQuantityGrid.kakaGrid.header = columns
          this.$refs.designQuantityGrid.invalidate()
        })
      }
    },
    methods: {
      ...mapActions([
        'getMaterialAnalyseDesignQuantity',
        'getStatMixerRatio'
      ]),
      getTableData () {

      },
      change (value) {
        this.$emit('change', value)
      },
      async openDlg () {
        this.activeTabHeaderName = '计算明细'
        this.columns = this.originColumns
        this.records = await this.getMaterialAnalyseDesignQuantity({ id: this.id })
        this.$emit('designQuantity', this.records)
        this.$refs.designQuantityGrid.invalidate()
      },
      async onButtonClick ({ key }) {
        this.$emit('change', false)
      }
    }
  }
</script>
<style lang="postcss" scoped>
  .designQuantity {
    .mu-dialog-footer {
      border-top: 1px solid #ebecf0;
    }
    .grid {
      width: 100%;
      height: calc(100% - 40px);
      padding: 16px;
      border: 1px solid #ebecf0;
      border-top: none;
    }
    .material_info_box {
      .material_name {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #ebecf0;
        text-align: center;
        background-color: #f5f5f5
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        li {
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-bottom: 1px solid #ebecf0;
          cursor: pointer;
        }
      }
    }
  }
</style>
