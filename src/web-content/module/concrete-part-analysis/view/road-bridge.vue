<template>
  <mu-h-box
    size="1"
    bordered-bottom
    bordered-right
    bordered-left>
    <mu-v-box
      size="328px"
      bordered-right>
      <mu-bar
        bordered-bottom
        class="pad-16">
        <b>单位工程/分部分项</b>
      </mu-bar>

      <mu-bar class="pad-8-16">
        <mu-button
          :icon-class="isExpand ? 'ipm-iconcaret-up' : 'ipm-iconcaret-down'"
          :caption="isExpand ? '收起' : '展开'"
          @click="checkTree" />

        <mu-editor
          v-model="searchText"
          size="1"
          icon="search"
          placeholder="按名称搜索"
          @change="filterTree" />
      </mu-bar>

      <mu-v-box size="1">
        <kaka-grid
          ref="treeGrid"
          class="mu-absolute-fit"
          :theme="{
            highlightBorderColor: 'transparent',
            frozenRowsBorderColor:borderColor,
            borderColor
          }"
          hide-header
          key-field="id"
          parent-key-field="parentId"
          :records="list"
          :columns="treeColumns"
          @cellclick="selectNode" />
      </mu-v-box>
    </mu-v-box>

    <mu-v-box size="1">
      <mu-bar
        bordered-bottom
        class="pad-8-16">
        <b>部位节超分析</b>

        <mu-space />
        <mu-button
          icon-class="ipm-iconexport"
          caption="导出Excel"
          :disabled="!activeNode"
          @click="exportExcel" />
      </mu-bar>

      <mu-v-box
        size="1"
        class="margin-16">
        <empty-panel
          v-if="!columns.length && showEmpty"
          tip-text="">
          <div class="f-16">
            {{ activeNode ? '当前分项未施工' : '当前未选择分项' }}
          </div>
        </empty-panel>

        <kaka-grid
          v-else
          ref="grid"
          class="mu-absolute-fit"
          :theme="{ highlightBorderColor: 'transparent'}"
          :columns="columns"
          :records="records" />
      </mu-v-box>
    </mu-v-box>

    <cmp-excel-file ref="excel" />
  </mu-h-box>
</template>

<script>
  import { treeUtil } from '@mctech/biz-data-utils'
  import EmptyPanel from '../../../components/empty-panel.vue'

  export default {
    components: {
      EmptyPanel
    },

    data () {
      return {
        list: [],
        backupList: {},
        activeNode: null,
        searchText: '',
        isExpand: true,

        records: [],
        columns: [],
        showEmpty: true
      }
    },

    computed: {
      treeColumns () {
        return [{
          field: 'name',
          width: '100%',
          type: 'tree',
          style: rec => this.setStyle(rec)
        }]
      }
    },

    created () {
      this.getProjectUnitWorks()
    },

    methods: {
      // 导出
      exportExcel () {
        const { projectUnitWorkId } = this.activeNode
        const puw = this.list.find(
          v => v.projectUnitWorkId === projectUnitWorkId
        )

        this.$refs.excel.export({
          type: 'nontunnelConcreteAnalysis',
          projectUnitWorkId,
          projectUnitWorkName: puw.name
        }, this.$http)
      },

      setStyle (rec) {
        if (this.activeNode && rec.id === this.activeNode.id) {
          return { bgColor: '#f4fbff' }
        }
      },

      borderColor (args) {
        const { col, grid: { colCount, frozenColCount } } = args
        if (frozenColCount - 1 === col || colCount - 1 === col) {
          return ['#EBECF0', null, '#EBECF0', null]
        } else {
          return ['#EBECF0', '#EBECF0', '#EBECF0', null]
        }
      },

      // 获取单位工程列表
      async getProjectUnitWorks () {
        const { dispatch } = this.$store
        const res = await dispatch('getProjectUnitWorks')

        if (res) {
          this.backupList = treeUtil.initTree(res)
          this.filterTree()
        }
      },

      filterTree () {
        const filterArr = treeUtil.filterTree(
          this.backupList.parentRecords,
          [{
            field: 'name',
            value: this.searchText.trim()
          }]
        )

        this.list.splice(0)
        this.list.push(...filterArr)

        this.$nextTick(() => {
          const vm = this.$refs.treeGrid
          if (vm && vm.kakaGrid) {
            vm.kakaGrid.dataSource.expandAll()
            this.isExpand = true
          }
        })
      },

      selectNode ({ col, row }, vm) {
        const rec = vm.kakaGrid.getRowRecord(row)
        if (!rec.hasPart) return
        if (this.activeNode && rec.id === this.activeNode.id) return

        this.activeNode = rec
        this.getConcreteAnalysis()
        vm.invalidate()
      },

      checkTree () {
        this.isExpand = !this.isExpand
        const func = this.isExpand ? 'expandAll' : 'collapseAll'
        this.$nextTick(() => {
          const vm = this.$refs.treeGrid
          if (vm && vm.kakaGrid) {
            vm.kakaGrid.dataSource[func]()
          }
        })
      },

      getColumns (headers) {
        if (!headers || !headers.length) return []
        const columns = headers.map(v => ({
          caption: v,
          columns: this.getSecondHeaders(v)
        }))

        const data = [
          {
            field: 'projectEntryWorkName',
            caption: '部位名称',
            width: 260,
            minWidth: 200
          },
          ...columns
        ]

        return data
      },

      getSecondHeaders (header) {
        const fields = [
          'DesignQuantity', // 设计量
          'ShouldQuantity', // 申请量
          'ActualQuantity', // 实耗量
          'DesignAnalysis', // 设计节超
          'ShouldAnalysis' // 申请节超
        ]

        const captions = {
          DesignQuantity: '设计量',
          ShouldQuantity: '申请量',
          ActualQuantity: '实耗量',
          DesignAnalysis: '设计节超',
          ShouldAnalysis: '申请节超'
        }

        const columns = fields.map(v => {
          const obj = {
            field: `${header}${v}`,
            caption: captions[v],
            width: 70,
            minWidth: 70,
            align: 'center'
          }

          if ('DesignAnalysis,ShouldAnalysis'.includes(v)) {
            obj.style = rec => ({ color: rec[`${header}${v}`] < 0 ? '#F57A79' : '#333' })
          }

          return obj
        })

        return columns
      },

      // 获取部位算量内容列表
      async getConcreteAnalysis () {
        this.showEmpty = false
        const { dispatch } = this.$store
        const { projectUnitWorkId, entryWorkId } = this.activeNode
        const res = await dispatch('getConcreteAnalysis', {
          projectUnitWorkId,
          entryWorkId
        })

        if (res) {
          const data = this.getColumns(res.specModels)
          this.columns = data
          this.records.splice(0)
          this.records.push(res.total, ...res.item)

          this.$nextTick(() => {
            const vm = this.$refs.grid
            if (vm && vm.kakaGrid) {
              this.showEmpty = true
              vm.initGrid()
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .pad-8-16 {
    padding: 8px 16px;
  }

  .margin-16 {
    margin: 16px;
  }

  .f-16 {
    font-size: 16px;
  }

  [bordered-top] {
    border-top: 1px solid #d9d9d9;
  }

  [bordered-right] {
    border-right: 1px solid #d9d9d9;
  }

  [bordered-bottom] {
    border-bottom: 1px solid #d9d9d9;
  }

  [bordered-left] {
    border-left: 1px solid #d9d9d9;
  }
</style>
