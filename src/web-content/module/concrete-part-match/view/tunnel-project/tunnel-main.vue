<template>
  <mu-h-box size="1"
    style="height: 100%;">
    <mu-v-box
      size="40%"
      style="min-width: 30%"
      border-right>
      <mu-bar
        class="table_title"
        border-bottom>
        <div>
          申请部位
        </div>
        <mu-space />
        <mu-button
          button-type="primary"
          @click="queryApplyPartFunc">
          查询
        </mu-button>
        <mu-button
          button-type="normal"
          @click="resetApplyPartFunc">
          重置
        </mu-button>
      </mu-bar>
      <div class="filter-box">
        <mu-date-range-editor
          format="yyyy年MM月dd"
          placeholder="选择申请日期"
          :start-date.sync="startDate"
          :end-date.sync="endDate"
          @change="changeDate" />
        <mu-combo-box
          ref="projectUnitWork"
          v-model="projectUnitWorks"
          editable
          multiple
          clearable
          placeholder="选择单位工程">
          <mu-editor
            v-model.trim="projectUnitWorkSearchKey"
            placeholder="请输入单位工程"
            icon-class="ipm-iconsearch"
            icon-align="left"
            class="select_option" />
          <mu-option
            v-for="item in candidateprojectUnitWorks"
            v-show="!item.hide"
            :key="item.projectUnitWorkId"
            :value="item.projectUnitWorkId"
            :label="item.projectUnitWorkName"
            :title="item.projectUnitWorkName" />
        </mu-combo-box>
        <mu-combo-box
          ref="entryWork"
          v-model="labels"
          multiple
          clearable
          placeholder="选择标号"
          :options="candidateLabels" />
        <mu-button-editor
          v-model.trim="startPile"
          icon="search"
          placeholder="输入开始桩号" />
        <i class="delimiter">~</i>
        <mu-button-editor
          v-model.trim="endPile"
          icon="search"
          placeholder="输入结束桩号" />
        <div />
      </div>
      <mu-flex-box
        size="1">
        <div id="applyGrid" style="width: 100%;height:100%" />
      </mu-flex-box>
    </mu-v-box>
    <mu-splitter style="background: transparent" />
    <mu-v-box
      style="min-width: 45%"
      size="auto">
      <cmp-mix-station-part
        :select-wbs-item="selectApplyItem"
        @changeLinked="changeLinked" />
    </mu-v-box>
  </mu-h-box>
</template>

<script>
  import dayjs from 'dayjs'
  import mixStationPart from './cmp-mix-station-part.vue'
  import applyPart from './grid/apply-part.js'
  export default {
    components: {
      'cmp-mix-station-part': mixStationPart
    },
    mixins: [applyPart],
    data () {
      return {
        startDate: '',
        endDate: '',
        projectUnitWorks: [],
        labels: [],
        candidateLabels: [],
        projectUnitWorkSearchKey: '',
        startPile: '',
        endPile: '',
        unitWorksOptions: [],
        tunnelApplyPartList: []
      }
    },
    computed: {
      candidateprojectUnitWorks () {
        this.unitWorksOptions.forEach(item => {
          item.hide = !!this.projectUnitWorkSearchKey && !item.projectUnitWorkName.includes(this.projectUnitWorkSearchKey)
        })
        return this.unitWorksOptions
      }
    },
    watch: {
    },
    mounted () {
      this.queryData()
    },
    methods: {
      async queryApplyPartFunc () {
        const params = this.setParams()
        this.tunnelApplyPartList = await this.$store.dispatch('getTunnelParts', params)
      },
      async resetApplyPartFunc () {
        this.projectUnitWorks = []
        this.labels = []
        this.projectUnitWorkSearchKey = ''
        this.startPile = ''
        this.endPile = ''
        this.startDate = ''
        this.endDate = ''
        const params = this.setParams()
        this.tunnelApplyPartList = await this.$store.dispatch('getTunnelParts', params)
      },
      async queryData () {
        const params = this.setParams()
        this.tunnelApplyPartList = await this.$store.dispatch('getTunnelParts', params)
        const candidateLabels = await this.$http.get('services/tunnel/concrete-parts/spec-model')
        this.candidateLabels = []
        candidateLabels.forEach(item => {
          if (item.specModel) {
            this.candidateLabels.push({
              value: item.specModel,
              label: item.specModel
            })
          }
        })
        this.unitWorksOptions = await this.$http.get('services/tunnel/concrete-parts/unit-work')
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
        if (this.projectUnitWorks.length > 0) {
          Object.assign(params, { projectUnitWorkIds: this.projectUnitWorks })
        }

        if (this.startPile) {
          Object.assign(params, { startPile: this.startPile })
        }
        if (this.endPile) {
          Object.assign(params, { endPile: this.endPile })
        }

        return params
      },
      async changeLinked (value) {
        if (value) {
          const params = this.setParams()
          this.tunnelApplyPartList = await this.$store.dispatch('getTunnelParts', params)
        }
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
  .table_title {
    padding: 8px 16px;
    > div {
      line-height: 32px;
      font-weight: bold;
    }
    > .mu-button {
      width: 68px;
    }
  }
  .select_option {
    width: calc(100% - 16px);
    margin: 4px 8px;
  }
  .filter-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px 16px 0 16px;
    > div {
      width: calc(33% - 8px);
      margin-bottom: 8px;
    }
    .delimiter {
      position: absolute;
      left: 33%;
      top: 57px;
    }
  }
</style>
