<template>
  <mu-h-box size="1"
    style="height: 100%;">
    <mu-v-box
      size="33%"
      style="min-width: 30%;"
      border-right>
      <mu-bar
        class="table_title"
        style=""
        border-bottom>
        <div>
          算量部位
        </div>
        <mu-space />
        <mu-button button-type="primary" @click="querySqPartFunc">
          查询
        </mu-button>
        <mu-button button-type="normal" @click="resetSqPartFunc">
          重置
        </mu-button>
      </mu-bar>
      <div class="filter-box">
        <mu-date-range-editor
          style="width: 31%;"
          format="yyyy年MM月dd"
          placeholder="选择申请日期"
          :start-date.sync="startDate"
          :end-date.sync="endDate"
          @change="changeDate" />
        <mu-combo-box
          ref="projectUnitWork"
          v-model="projectUnitWorks"
          style="width: 31%;"
          :editable="false"
          :multiple="true"
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
            :key="item.id"
            :value="item.id"
            :label="item.name"
            :title="item.name"
            @click="selectUnitWorkCategories(item)" />
        </mu-combo-box>
        <mu-combo-box
          ref="entryWork"
          v-model="entryWorks"
          style="width: 31%;"
          :editable="false"
          :multiple="true"
          clearable
          :placeholder="entryWorkPlaceholder">
          <mu-editor
            v-model.trim="entryWorkSearchKey"
            placeholder="请输入分部分项"
            icon-class="ipm-iconsearch"
            icon-align="left"
            class="select_option" />
          <mu-option
            v-for="(item) in candidateEntryWorks"
            v-show="!item.hide"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            :title="item.name" />
        </mu-combo-box>
        <mu-editor
          v-model="partSearch"
          icon-align="right"
          icon="search"
          style="width: 31%;"
          placeholder="请输入部位名称" />
        <mu-combo-box
          ref="entryWork"
          v-model="labels"
          style="width: 31%;"
          multiple
          clearable
          placeholder="选择标号"
          :options="candidateLabels" />
        <mu-combo-box
          v-model="type"
          style="width: 31%;"
          placeholder="选择部位类型"
          :clearable="false"
          :options="typeOptions" />
      </div>
      <mu-flex-box
        size="1"
        style="position: relative;">
        <div id="wbsGrid" style="width: 100%;height:100%" />
        <div v-show="showCancelPart"
          ref="cancelPart"
          class="cancelPartBox"
          @mousedown="cancelNewSetPart">
          取消设置新增部位
        </div>
        <input ref="hiddenInput" class="hiddenInput" type="text" @blur="blurInput">
      </mu-flex-box>
      <mu-flex-box
        v-show="totalSqPartLength > 0"
        class="pagination_box">
        <mu-page
          :offset.sync="offset"
          :limit.sync="limit"
          :page-size-options="pageSizeOptions"
          :data-length="totalSqPartLength" />
      </mu-flex-box>
    </mu-v-box>
    <mu-splitter style="background: transparent" />
    <mu-v-box
      size="auto"
      style="min-width: 45%">
      <mu-tabs
        class="mu-absolute-fit tab-box"
        model-control="external"
        :active-tab="activeTabName"
        :tab-position="pos"
        :tab-style="style"
        @change="onTabChange">
        <mu-tab-panel name="申请部位" size="auto">
          <cmp-apply-part
            ref="appPart"
            :select-wbs-item="selectWbsItem"
            @changeLinked="changeLinked" />
        </mu-tab-panel>
        <mu-tab-panel name="机楼部位" size="auto">
          <cmp-mix-station-part
            :select-wbs-item="selectWbsItem"
            @changeLinked="changeLinked" />
        </mu-tab-panel>
      </mu-tabs>
    </mu-v-box>
  </mu-h-box>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import dayjs from 'dayjs'
  import cmpApplyPart from './cmp-apply-part.vue'
  import cmpMixStationPart from './cmp-mix-station-part.vue'
  import wbsGrid from './grid/wbs-grid.js'
  const TYPE_OPTIONS = [
    { label: '全部', value: 1 },
    { label: '未施工', value: 2 },
    { label: '已施工', value: 3 }
  ]
  export default {
    components: {
      cmpApplyPart,
      cmpMixStationPart
    },
    mixins: [wbsGrid],
    data () {
      return {
        pos: 'top',
        style: 'simple',
        activeTabName: '申请部位',
        startDate: '',
        endDate: '',
        projectUnitWorks: [],
        entryWorks: [],
        labels: [],
        type: 1,
        partSearch: '',
        projectUnitWorkSearchKey: '',
        entryWorkSearchKey: '',
        labelSearchKey: '',
        typeOptions: TYPE_OPTIONS,
        offset: 0,
        limit: 50,
        pageSizeOptions: [50, 200],
        showCancelPart: false
      }
    },
    computed: {
      ...mapState({
        unitWorksOptions: 'unitWorksOptions',
        entryWorksOptions: 'entryWorksOptions',
        sqPartList: 'sqPartList',
        candidateLabels: 'sqPartSpecModel',
        totalSqPartLength: 'sqPartCount'
      }),
      candidateprojectUnitWorks () {
        this.unitWorksOptions.forEach(item => {
          item.hide = !!this.projectUnitWorkSearchKey && !item.name.includes(this.projectUnitWorkSearchKey)
        })
        return this.unitWorksOptions
      },
      candidateEntryWorks () {
        this.entryWorksOptions.forEach(item => {
          item.hide = !!this.entryWorkSearchKey && !item.name.includes(this.entryWorkSearchKey)
        })
        return this.entryWorksOptions
      },
      entryWorkPlaceholder () {
        return this.projectUnitWorks.length ? '请选择分部分项' : '请先选择单位工程'
      }
    },
    watch: {
      projectUnitWorks (newValue) {
        if (newValue.length === 0) {
          this.entryWorks = []
          this.entryWorksOptions.forEach(ele => {
            ele.hide = true
          })
        }
      },
      offset () {
        this.querySqPartList(this.setParams(false))
      },
      limit (limit) {
        this.offset = 0
        this.querySqPartList(this.setParams(false))
      },
      activeTabName (val) {
        this.selectWbsItem = {}
        this.wbsGrid.selectCellRange(-1, 0, -1, 0)
      }
    },
    async mounted () {
      this.queryUnitWorksOption()
      await this.querySqPartList(this.setParams())
    },
    methods: {
      ...mapActions([
        'queryUnitWorksOption',
        'queryEntryWorksOption',
        'querySqPartList',
        'applyPartCancelAdd'
      ]),
      selectUnitWorkCategories (item) {
        if (item && this.projectUnitWorks.length > 0) {
          this.queryEntryWorksOption({ unitWorkIds: this.projectUnitWorks })
        }
      },
      selectLabel (item) {},
      onTabChange (tabName) {
        this.activeTabName = tabName
      },
      async querySqPartFunc () {
        this.offset = 0
        this.querySqPartList(this.setParams())
      },
      async resetSqPartFunc () {
        this.projectUnitWorks = []
        this.entryWorks = []
        this.labels = []
        this.type = 1
        this.partSearch = ''
        this.projectUnitWorkSearchKey = ''
        this.entryWorkSearchKey = ''
        this.labelSearchKey = ''
        this.startDate = ''
        this.endDate = ''
        this.offset = 0
        this.querySqPartList(this.setParams())
      },
      setParams () {
        const params = {
          projectUnitWorkIds: this.projectUnitWorks,
          entryWorkIds: this.entryWorks,
          specModels: this.labels,
          offset: this.offset,
          limit: this.limit
        }
        if (this.type) {
          const typeArr = ['all', 'unrelated', 'related']
          Object.assign(params, { relatedStatus: typeArr[this.type - 1] })
        }
        if (this.startDate) {
          Object.assign(params, { startDate: dayjs(this.startDate).format('YYYY-MM-DD') })
        }
        if (this.endDate) {
          Object.assign(params, { endDate: dayjs(this.endDate).format('YYYY-MM-DD') })
        }
        if (this.partSearch) {
          Object.assign(params, { partName: this.partSearch })
        }
        return params
      },
      // 申请和机楼部分设置或者取消关联后刷新表格
      async changeLinked (params) {
        if (params) {
          this.querySqPartList(this.setParams())
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
  ::v-deep .kaka-grid__inline-menu__menu-item {
    padding: 0 8px;
    background: #ffffff;
  }
  .mu-tabs {
    .mu-tabs-header[tab-style=simple] {
      height: 49px !important;
    }
    .mu-tabs-header[tab-style=simple]~.mu-tab-panel {
      padding: 0;
    }
    .mu-tabs-header[tab-position=top] .mu-tab-item {
      background: #ffffff;
    }
  }
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
      margin-bottom: 8px;
    }
  }
  .pagination_box {
    display: flex;
    overflow: auto;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    border-top: 1px solid #ebecf0
  }
  .cancelPartBox {
    width: 134px;
    height: 36px;
    padding: 10px 18px;
    background: #ffffff;
    z-index: 99;
    position: absolute;
    top:0;
    left: -28px;
    border: 1px solid #ebecf0;
    border-radius: 2px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.10);
    cursor: pointer;
  }
  .hiddenInput {
    width: 0;
    height: 0;
    z-index: -1;
    padding: 0;
    border: none;
  }
</style>
