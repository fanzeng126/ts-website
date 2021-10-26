<template>
  <mu-v-box class="pad-16" style="height:100%;">
    <mu-bar class="f-16 margin-b-16"><b>队伍实时节超分析</b></mu-bar>
    <mu-v-box size="1">
      <mu-tabs-header
        :active-tab="activeTabName"
        :tab-items="tabItems"
        model-control="external"
        tab-style="card"
        @change="tabChange" />

      <mu-v-box
        size="1"
        border-bottom
        border-right
        border-left>
        <mu-bar
          class="pad-8-16"
          border-bottom>
          <mu-combo-box
            v-model="teamName"
            editable
            multiple
            clearable
            :options="teamList"
            placeholder="请选择队伍"
            @change="teamChange" />

          <mu-date-editor
            v-show="activeTabName==='month'"
            v-model="monthDate"
            format="YYYY年MM月"
            placeholder="请选择月份"
            select-mode="month"
            :clearable="false"
            @change="changeDate" />

          <mu-date-editor
            v-show="activeTabName==='day'"
            v-model="dayDate"
            :clearable="false"
            format="YYYY年MM月DD日"
            placeholder="请选择日期"
            @change="changeDate" />

          <mu-space />
          <mu-button
            caption="导出"
            icon-class="ipm-iconexport"
            @click="exportExcel" />
        </mu-bar>

        <mu-bar border-bottom>
          <div class="pad-16" style="width:33%;" border-right>
            项目名称：{{ orgName }}
          </div>
          <div class="pad-16" style="width:33%;" border-right>
            数据截止时间：{{ deadline }}
          </div>
          <div class="pad-16" style="width:34%;">
            单位：m³
          </div>
        </mu-bar>

        <div style="height: 100%;">
          <kaka-grid
            ref="kakaGrid"
            class="mu-absolute-fit pad-16"
            :columns="columns"
            :records="records" />
        </div>
      </mu-v-box>
    </mu-v-box>
    <cmp-excel-file ref="excel" />
  </mu-v-box>
</template>

<script>
  import dayjs from 'dayjs'
  import debounce from 'lodash.debounce'
  export default {
    inject: ['context'],
    data () {
      return {
        activeTabName: 'month',
        tabItems: [
          {
            name: 'month',
            label: '月度节超分析'
          },
          {
            name: 'day',
            label: '每日实时节超分析'
          }
        ],

        teamName: [],
        teamList: [],

        monthDate: new Date(),
        dayDate: new Date(),

        records: []
      }
    },

    computed: {
      orgName () {
        return this.context.orgShortName
      },
      columns () {
        const isMonth = this.activeTabName === 'month'
        return [
          {
            field: 'key',
            caption: '序号',
            align: 'center',
            width: 60
          },
          {
            field: 'name',
            caption: '队伍/混凝土标号',
            align: 'center',
            width: 140
          },
          ...(!isMonth
            ? [
              {
                caption: '当日节超',
                headerStyle: { textAlign: 'center' },
                columns: [
                  {
                    caption: '设计量',
                    field: 'dayDesignQuantity',
                    width: 90,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '申请量',
                    field: 'dayShouldQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '实耗量',
                    field: 'dayActualQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '设计节超',
                    field: 'dayDesignAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.dayDesignAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  },
                  {
                    caption: '申请节超',
                    field: 'dayShouldAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.dayShouldAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  }
                ]
              }
            ] : []),
          {
            caption: '开累节超',
            headerStyle: { textAlign: 'center' },
            columns: [
              {
                caption: '设计量',
                field: 'cumulativeDesignQuantity',
                width: 100,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' }
              },
              {
                caption: '申请量',
                field: 'cumulativeShouldQuantity',
                width: 100,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' }
              },
              {
                caption: '实耗量',
                field: 'cumulativeActualQuantity',
                width: 100,
                headerStyle: { textAlign: 'center' },
                style: { textAlign: 'center' }
              },
              {
                caption: '设计节超',
                field: 'cumulativeDesignAnalysis',
                width: 100,
                headerStyle: { textAlign: 'center' },
                style: rec => {
                  return {
                    color: rec.cumulativeDesignAnalysis < 0 ? '#F57A79' : '',
                    textAlign: 'center'
                  }
                }
              },
              {
                caption: '申请节超',
                field: 'cumulativeShouldAnalysis',
                width: 100,
                headerStyle: { textAlign: 'center' },
                style: rec => {
                  return {
                    color: rec.cumulativeShouldAnalysis < 0 ? '#F57A79' : '',
                    textAlign: 'center'
                  }
                }
              }
            ]
          },
          ...(isMonth
            ? [
              {
                caption: '本年节超',
                headerStyle: { textAlign: 'center' },
                columns: [
                  {
                    caption: '设计量',
                    field: 'yearDesignQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '申请量',
                    field: 'yearShouldQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '实耗量',
                    field: 'yearActualQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '设计节超',
                    field: 'yearDesignAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.yearDesignAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  },
                  {
                    caption: '申请节超',
                    field: 'yearShouldAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.yearShouldAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  }
                ]
              },
              {
                caption: '本月节超',
                headerStyle: { textAlign: 'center' },
                columns: [
                  {
                    caption: '设计量',
                    field: 'monthDesignQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '申请量',
                    field: 'monthShouldQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '实耗量',
                    field: 'monthActualQuantity',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: { textAlign: 'center' }
                  },
                  {
                    caption: '设计节超',
                    field: 'monthDesignAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.monthDesignAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  },
                  {
                    caption: '申请节超',
                    field: 'monthShouldAnalysis',
                    width: 100,
                    headerStyle: { textAlign: 'center' },
                    style: rec => {
                      return {
                        color: rec.monthShouldAnalysis < 0 ? '#F57A79' : '',
                        textAlign: 'center'
                      }
                    }
                  }
                ]
              }
            ] : []),
          {
            field: 'remark',
            caption: '备注',
            minWidth: 100,
            width: 'auto',
            headerStyle: { textAlign: 'center' },
            style: { textAlign: 'center' }
          }
        ]
      },

      deadline () {
        return dayjs(this.activeTabName === 'month' ? this.monthDate : this.dayDate).format(`YYYY年MM月${this.activeTabName === 'month' ? '' : 'DD日'}`)
      }
    },

    mounted () {
      this.$store.dispatch('getTeams').then(res => {
        if (res.length) {
          this.teamList =
            res.map(ele => { return { value: ele.name, label: ele.name } })
        }
      })
      this.getList()
    },

    methods: {

      tabChange (val) {
        if (this.activeTabName === val) return
        this.activeTabName = val
        this.$nextTick(() => {
          const grid = this.$refs.kakaGrid
          grid.kakaGrid.invalidate()
          grid.initGrid()
        })
        this.getList()
      },

      changeDate (val) {
        this.getList()
      },

      teamChange: debounce(function (val) {
        this.getList()
      }, 1000),

      async getList () {
        const params = {
          teamName: this.teamName,
          dataType: this.activeTabName,
          dateTime: this.activeTabName === 'month' ? this.monthDate : this.dayDate
        }
        params.dateTime = dayjs(params.dateTime).format('YYYY-MM-DD HH:mm:ss')
        const res = await this.$store.dispatch('getTeamConcreteAnalysis', params)
        if (res) this.records = res
      },

      exportExcel () {
        const isMonth = this.activeTabName === 'month'
        const params = {
          type: `teamConcreteAnalysis${isMonth ? 'Month' : 'Day'}`,
          teamName: this.teamName,
          dataType: this.activeTabName,
          dateTime: dayjs(isMonth ? this.monthDate : this.dayDate).format('YYYY-MM-DD HH:mm:ss'),
          projectName: this.orgName,
          date: this.deadline
        }
        this.$refs.excel.export(params, this.$http, `teamConcreteAnalysis${isMonth ? 'Month' : 'Day'}`)
      }
    }

  }
</script>

<style scoped>
  .f-16 {
    font-size: 16px;
  }

  .margin-b-16 {
    margin-bottom: 16px;
  }

  .margin-r-8 {
    margin-right: 8px;
  }

  .pad-8-16 {
    padding: 8px 16px;
  }

  .flex-item {
    width: calc(50% -8px);
    font-size: 14px;
  }

  [justify-content="space-between"] {
    justify-content: space-between
  }
</style>
