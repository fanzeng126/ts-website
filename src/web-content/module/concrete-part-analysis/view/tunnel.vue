<template>
  <mu-v-box
    size="1"
    bordered-bottom
    bordered-right
    bordered-left>
    <mu-bar
      class="pad-8-16"
      bordered-bottom>
      <mu-combo-box
        v-model="projectUnitWorkId"
        :options="unitWorkList"
        :clearable="false"
        placeholder="请选择单位工程"
        @change="unitWorkChange" />
      <mu-button-group>
        <mu-button
          :button-type="categroyType==='rockGrade' ? 'primary' : 'normal'"
          button-style="outline"
          @click="btnClick('rockGrade')">
          按围岩等级汇总
        </mu-button>
        <mu-button
          style="border-left:1px solid #008cd6;"
          :button-type="categroyType==='pile' ? 'primary' : 'normal'"
          button-style="outline"
          @click="btnClick('pile')">
          按里程汇总
        </mu-button>
      </mu-button-group>
      <mu-space />
      <mu-button
        caption="导出Excel"
        icon-class="ipm-iconexport"
        @click="exportExcel" />
    </mu-bar>

    <div style="height: 100%;">
      <kaka-grid
        ref="kakaGrid"
        class="mu-absolute-fit pad-16"
        :columns="header"
        :records="records" />
      <empty-panel v-if="!header.length" tip-text="">
        <div class="f-16">
          暂无数据
        </div>
      </empty-panel>
    </div>
    <cmp-excel-file ref="excel" />
  </mu-v-box>
</template>

<script>
  import { mapState } from 'vuex'
  import debounce from 'lodash.debounce'
  import EmptyPanel from '../../../components/empty-panel.vue'

  export default {
    name: 'Tunnel',
    components: {
      EmptyPanel
    },

    data () {
      return {
        projectUnitWorkId: '',
        unitWorkList: [],

        categroyType: 'rockGrade',

        header: [],
        records: []
      }
    },

    computed: {
      ...mapState({
        activeTabName: 'activeTabName'
      }),

      columns () {
        return [
          {
            caption: '单位工程',
            align: 'center',
            columns: [
              {
                caption: '里程段',
                align: 'center',
                columns: [
                  {
                    caption: '围岩等级/衬砌类型',
                    align: 'center',
                    columns: [
                      {
                        caption: '序号',
                        type: 'no',
                        width: 60,
                        align: 'center'
                      },
                      {
                        field: 'specModel',
                        caption: '标号',
                        align: 'center'
                      }
                    ]
                  }
                ]
              }
            ]
          },

          {
            caption: '凤安隧道右线',
            align: 'center',
            columns: [
              {
                caption: 'K30+000~K40+000',
                align: 'center',
                columns: [
                  {
                    caption: 'Vc',
                    align: 'center',
                    columns: [
                      {
                        caption: '设计量',
                        field: 'DesignQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '应耗量',
                        field: 'ShouldQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '实耗量',
                        field: 'ActualQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '设计节超',
                        field: 'DesignAnalysis',
                        width: 100,
                        align: 'center',
                        style: {
                          color: '#F57A79'// 小于零返回，否则不返
                        }
                      },
                      {
                        caption: '应耗节超',
                        field: 'ShouldAnalysis',
                        width: 100,
                        align: 'center',
                        style: {
                          color: '#F57A79'// 小于零返回，否则不返
                        }
                      }
                    ]
                  }
                ]
              },
              {
                field: 'key',
                caption: 'K30+000~K40+000',
                align: 'center',
                columns: [
                  {
                    field: 'key',
                    caption: 'IIIb',
                    align: 'center',
                    columns: [
                      {
                        caption: '设计量',
                        field: 'DesignQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '应耗量',
                        field: 'ShouldQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '实耗量',
                        field: 'ActualQuantity',
                        width: 100,
                        align: 'center'
                      },
                      {
                        caption: '设计节超',
                        field: 'DesignAnalysis',
                        width: 100,
                        align: 'center',
                        style: {
                          color: '#F57A79'// 小于零返回，否则不返
                        }
                      },
                      {
                        caption: '应耗节超',
                        field: 'ShouldAnalysis',
                        width: 100,
                        align: 'center',
                        style: {
                          color: '#F57A79'// 小于零返回，否则不返
                        }
                      }
                    ]
                  }
                ]
              },
              {
                field: 'key',
                caption: 'K30+000~K40+000',
                align: 'center',
                columns: [
                  {
                    caption: '设计量',
                    field: 'DesignQuantity',
                    width: 100,
                    align: 'center'
                  },
                  {
                    caption: '应耗量',
                    field: 'ShouldQuantity',
                    width: 100,
                    align: 'center'
                  },
                  {
                    caption: '实耗量',
                    field: 'ActualQuantity',
                    width: 100,
                    align: 'center'
                  },
                  {
                    caption: '设计节超',
                    field: 'DesignAnalysis',
                    width: 100,
                    align: 'center',
                    style: {
                      color: '#F57A79'// 小于零返回，否则不返
                    }
                  },
                  {
                    caption: '应耗节超',
                    field: 'ShouldAnalysis',
                    width: 100,
                    align: 'center',
                    style: {
                      color: '#F57A79'// 小于零返回，否则不返
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    },

    watch: {
      async activeTabName (val) {
        if (val && val === 'tunnel' && !this.unitWorkList.length) {
          await this.getTunnelProjectUnitWorks()
          if (!this.projectUnitWorkId || !this.unitWorkList.length) return
          this.getTunnelConcreteAnalysis()
        }
      }
    },

    methods: {
      // 获取单位工程
      async getTunnelProjectUnitWorks () {
        const res = await this.$store.dispatch('getTunnelProjectUnitWorks')
        if (res && res.length > 0) {
          const unitWorkList = res.map(ele => {
            return {
              value: ele.id,
              label: ele.name
            }
          })
          this.unitWorkList = unitWorkList
          this.projectUnitWorkId = res[0].id
        }
      },

      // 查询部位节超分析
      async getTunnelConcreteAnalysis () {
        const params = {
          categroyType: this.categroyType,
          projectUnitWorkId: this.projectUnitWorkId
        }
        // 添加style
        function addStyle (col) {
          if (!col.columns.length) return
          col.columns.forEach(key => {
            if (key.columns) {
              addStyle(key)
            } else {
              if (['设计节超', '应耗节超'].includes(key.caption)) {
                key.style = function (rec) {
                  return {
                    color: rec[key.field] < 0 ? '#F57A79' : ''
                  }
                }
              }
            }
          })
        }

        const res = await this.$store.dispatch('getTunnelConcreteAnalysis', params)
        if (res) {
          if (res.header && res.header.length) {
            res.header.forEach(ele => {
              if (ele.columns) addStyle(ele)
            })
          }
          this.header = res.header || []
          this.records = res.records || []
          this.refreshGrid()
        }
      },

      // 刷新表格
      refreshGrid () {
        this.$nextTick(() => {
          const grid = this.$refs.kakaGrid
          grid.kakaGrid.invalidate()
          grid.initGrid()
        })
      },

      // 单位工程被选择
      unitWorkChange: debounce(function (val) {
        this.getTunnelConcreteAnalysis()
      }, 1000),

      // 汇总按钮被点击
      btnClick (val) {
        if (this.categroyType === val) return
        this.categroyType = val
        this.getTunnelConcreteAnalysis()
      },

      // 导出Excel
      exportExcel () {
        if (!this.projectUnitWorkId || !this.unitWorkList.length) return
        const index =
          this.unitWorkList.findIndex(v => v.value === this.projectUnitWorkId)

        const projectUnitWorkName = this.unitWorkList[index].label
        if (!projectUnitWorkName) return

        const params = {
          type: 'tunnelConcreteAnalysis',
          categroyType: this.categroyType,
          projectUnitWorkId: this.projectUnitWorkId,
          projectUnitWorkName
        }

        this.$refs.excel.export(params, this.$http, 'tunnelConcreteAnalysis')
      }
    }
  }
</script>

<style scoped>
  .pad-8-16 {
    padding: 8px 16px;
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
