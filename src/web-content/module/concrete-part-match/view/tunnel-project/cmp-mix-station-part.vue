<template>
  <mu-v-box size="1"
    class="mix_station_box">
    <mu-bar
      class="table_title"
      border-bottom>
      机楼部位
    </mu-bar>
    <mu-h-box class="filter-box">
      <mu-date-range-editor
        style="width: 19%;"
        format="yyyy年MM月dd"
        placeholder="选择发料日期"
        :start-date.sync="startDate"
        :end-date.sync="endDate"
        @change="changeDate" />
      <mu-button-editor
        v-model.trim="partSearch"
        style="width: 19%;"
        icon="search"
        placeholder="请输入部位名称" />
      <mu-combo-box
        ref="entryWork"
        v-model="labels"
        style="width: 19%;"
        editable
        multiple
        clearable
        :options="candidateLabels"
        placeholder="选择标号" />
      <mu-combo-box
        v-model="type"
        style="width: 19%;"
        placeholder="选择关联状态"
        :options="typeOptions"
        :clearable="false" />
      <div style="text-align: right;">
        <mu-button button-type="primary"
          @click="selectData">
          查询
        </mu-button>
        <mu-button button-type="normal"
          @click="resetMixPartFunc">
          重置
        </mu-button>
      </div>
    </mu-h-box>
    <mu-h-box class="set_link_box">
      <mu-button button-type="primary"
        :disabled="!linked"
        @click="setLinkedFn">
        关联当前部位
      </mu-button>
      <mu-button button-type="normal"
        :disabled="!cancelLinked"
        @click="cancelLinkedFn">
        取消关联部位
      </mu-button>
    </mu-h-box>
    <mu-flex-box size="1"
      style="padding: 8px">
      <div id="tunnelStationPart" style="width: 100%;height:100%" />
    </mu-flex-box>
    <mu-flex-box
      v-show="totalMixStationLength>0"
      class="pagination_box">
      <mu-page
        :offset.sync="offset"
        :limit.sync="limit"
        :page-size-options="pageSizeOptions"
        :data-length="totalMixStationLength" />
    </mu-flex-box>
  </mu-v-box>
</template>
<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'
  import mixStationPart from './grid/mix-station-part.js'
  import { notify } from '@mctech/mussel'
  const TYPE_OPTIONS = [
    { label: '全部', value: '0' },
    { label: '未关联', value: 1 },
    { label: '已关联', value: 2 },
    { label: '已关联当前部位', value: 3 }
  ]
  export default {
    mixins: [mixStationPart],
    props: {
      selectWbsItem: {
        type: Object,
        default: () => {
          return null
        }
      }
    },
    data () {
      return {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
        labels: [],
        type: 1,
        partSearch: '',
        candidateLabels: [],
        typeOptions: TYPE_OPTIONS,
        offset: 0,
        limit: 50,
        totalMixStationLength: 0,
        pageSizeOptions: [50, 200],
        mixStationPartList: [],
        checkArr: [],
        linked: false,
        cancelLinked: false
      }
    },
    computed: {
      ...mapState({
        statMonth: 'statMonth',
        activeTabName: 'activeTabName'
      })
    },
    watch: {
      statMonth: {
        handler (val) {
          const { startDate, endDate } = val
          this.startDate = startDate
          this.endDate = endDate
        },
        immediate: true
      },
      checkArr (val) {
        this.linked = this.selectWbsItem && this.checkArr.length > 0
        this.cancelLinked = this.checkArr.filter(item => item.isRelated).length > 0
      },
      selectWbsItem (val) {
        this.linked = this.selectWbsItem && this.checkArr.length > 0
      },
      offset () {
        this.queryData()
      },
      limit (limit) {
        this.offset = 0
        this.queryData()
      },
      activeTabName (val) {
        if (val === '隧道工程') {
          this.resetMixPartFunc()
        }
      }
    },
    mounted () {
      this.queryData()
    },
    methods: {
      selectData () {
        if (this.type === 3) {
          if (!this.selectWbsItem) {
            notify('warning', '请先选择算量部位')
            return
          }
        }
        this.offset = 0
        this.queryData()
      },
      async queryData () {
        const fn1 = this.$http.post('services/tunnel/machine-parts', this.setParams())
        const fn2 = this.$http.get('services/tunnel/machine-parts/spec-model')
        const res = await Promise.all([fn1, fn2])
        const { data: list, count } = res[0]
        this.candidateLabels = []
        res[1].forEach((item, index) => {
          if (item.strength) {
            this.candidateLabels.push({
              label: item.strength,
              value: 1000 + index
            })
          }
        })
        const tempCheckData = []
        if (this.checkArr.length > 0) {
          const tempCheckPartIds = this.checkArr.map(item => {
            return item.partId
          })
          list.forEach(item => {
            if (tempCheckPartIds.includes(item.partId)) {
              item.check = true
              tempCheckData.push(item)
            } else {
              item.check = false
            }
          })
        }
        this.checkArr = tempCheckData
        if (this.checkArr.length === list.length && list.length !== 0) {
          this.mixPartGrid.headerValues.set('check', true)
        } else this.mixPartGrid.headerValues.set('check', false)
        this.mixStationPartList.splice(0, this.mixStationPartList.length, ...list)
        this.totalMixStationLength = count
      },
      resetMixPartFunc () {
        const { startDate, endDate } = this.statMonth
        this.startDate = startDate
        this.endDate = endDate
        this.labels = []
        this.type = 1
        this.partSearch = ''
        this.startDate = this.statMonth.startDate
        this.endDate = this.statMonth.endDate
        this.offset = 0
        this.queryData()
      },
      async setLinkedFn () {
        if (!this.selectWbsItem) return
        const {
          id,
          projectUnitWorkId,
          specModel
        } = this.selectWbsItem
        const cancelRelatedRefIds = []
        const produceRecordIds = []
        // 已经关联,但是关联了其他算量部位
        this.checkArr.forEach(item => {
          const isSameSqPart = id === item.viewId
          if (item.isRelated && !isSameSqPart) {
            cancelRelatedRefIds.push(item.recordRefId)
            produceRecordIds.push(item.partId)
          }
          if (!item.isRelated) {
            produceRecordIds.push(item.partId)
          }
        })
        let result = false
        if (cancelRelatedRefIds.length > 0) {
          result = await this.$http.patch('services/tunnel/machine-parts/cancel-related', { recordRefIds: cancelRelatedRefIds })
        }
        if (produceRecordIds.length > 0) {
          const params = {
            viewId: id,
            produceRecordIds
          }
          if (specModel) {
            Object.assign(params, { specModel })
          }
          if (projectUnitWorkId) {
            Object.assign(params, { projectUnitWorkId })
          }
          result = await this.$http.patch('services/tunnel/machine-parts/related', params)
        }
        if (!result) {
          return
        }
        notify('success', '关联成功')
        this.$emit('changeLinked', true)
        if (this.type === 3) {
          if (!this.selectWbsItem) {
            notify('warning', '请先选择算量部位')
            return
          }
        }
        this.checkArr = []
        this.offset = 0
        this.queryData()
      },
      async cancelLinkedFn () {
        const filters = this.checkArr.filter(item => item.isRelated && item.recordRefId)
        const recordRefIds = filters.map(item => {
          return item.recordRefId
        })
        const result = await this.$http.patch('services/tunnel/machine-parts/cancel-related', { recordRefIds })
        if (!result) return
        notify('success', '取消成功')
        this.$emit('changeLinked', true)
        if (this.type === 3) {
          if (!this.selectWbsItem) {
            notify('warning', '请先选择算量部位')
            return
          }
        }
        this.checkArr = []
        this.offset = 0
        this.queryData()
      },
      setParams () {
        const params = {}
        if (this.startDate) {
          params.startDate = dayjs(this.startDate).format('YYYY-MM-DD')
        }
        if (this.endDate) {
          params.endDate = dayjs(this.endDate).format('YYYY-MM-DD')
        }
        if (this.partSearch) {
          params.partName = this.partSearch
        }
        if (this.labels.length > 0) {
          const filterSpecModels = this.candidateLabels.filter(item => this.labels.includes(item.value))
          if (filterSpecModels.length > 0) {
            const specModels = filterSpecModels.map(item => item.label)
            Object.assign(params, { specModels })
          }
        }
        if (this.type) {
          Object.assign(params, { relatedStatus: this.type })
          if (this.type === 3) {
            if (!this.selectWbsItem) {
              notify('warning', '请先选择算量部位')
              return
            }
            const {
              id
            } = this.selectWbsItem
            Object.assign(params, {
              viewId: id
            })
          }
        }
        Object.assign(params, { offset: this.offset, limit: this.limit })
        return params
      },
      changeDate (val) {
        if (val) {
          const { startDate, endDate } = val
          if (startDate && !endDate) {
            this.startDate = dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00'
          }
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
  .mix_station_box {
    height: 100%;
    .table_title {
      padding: 16px;
      font-weight: bold;
    }
  }
  .mu-button {
    width: 68px;
    margin: 0 4px;
  }
  .set_link_box {
    padding: 8px 16px;
    border-bottom: 1px solid #ebecf0;
    border-top: 1px solid #ebecf0;
    .mu-button {
      width: 106px;
      margin-right: 8px;
      margin-left: 0;
    }
  }
  .select_option {
    width: calc(100% - 16px);
    margin: 4px 8px;
  }
  .filter-box {
    justify-content: space-between;
    padding: 8px 16px;
  }
  .pagination_box {
    display: flex;
    overflow: auto;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    border-top: 1px solid #ebecf0;
  }
</style>
