<template>
  <mu-v-box size="1"
    class="apply_part_box">
    <mu-h-box class="filter-box">
      <mu-date-range-editor
        style="width: 14%;"
        format="yyyy年MM月dd"
        placeholder="选择申请日期"
        :start-date.sync="startDate"
        :end-date.sync="endDate"
        @change="changeDate" />
      <mu-combo-box
        ref="projectUnitWork"
        v-model="projectUnitWorks"
        style="width: 14%;"
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
          :key="item.id"
          :value="item.id"
          :label="item.name"
          :title="item.name"
          @click="selectUnitWorkCategories(item)" />
      </mu-combo-box>
      <mu-combo-box
        ref="entryWork"
        v-model="entryWorks"
        style="width: 14%;"
        editable
        multiple
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
        style="width: 14%;"
        placeholder="请输入部位名称" />
      <mu-combo-box
        ref="entryWork"
        v-model="labels"
        style="width: 14%;"
        editable
        multiple
        clearable
        :options="candidateLabels"
        placeholder="选择标号" />
      <mu-combo-box
        v-model="type"
        style="width: 14%;"
        placeholder="选择关联状态"
        :clearable="false"
        :options="typeOptions" />
      <mu-button button-type="primary"
        @click="queryApplyPartFunc">
        查询
      </mu-button>
      <mu-button button-type="normal"
        @click="resetApplyPartFunc">
        重置
      </mu-button>
    </mu-h-box>
    <mu-h-box class="set_link_box">
      <mu-button button-type="primary"
        :disabled="!beLinkedDisabled"
        @click="setLinkedFunc">
        关联当前部位
      </mu-button>
      <mu-button button-type="normal"
        :disabled="!cancelLinkedDisabled"
        @click="cancelLinkedFunc">
        取消关联部位
      </mu-button>
      <mu-button button-type="normal"
        :disabled="!newSetLinkedDisabled"
        @click="setNewPartLinkedFunc">
        设置为新增部位
      </mu-button>
    </mu-h-box>
    <mu-flex-box size="1"
      style="padding: 16px;">
      <div id="applyPart" style="width: 100%;height:100%" />
    </mu-flex-box>
    <mu-flex-box
      v-show="totalApplyPartLength > 0"
      class="pagination_box">
      <mu-page
        :offset.sync="offset"
        :limit.sync="limit"
        :page-size-options="pageSizeOptions"
        :data-length="totalApplyPartLength" />
    </mu-flex-box>
  </mu-v-box>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import { notify } from '@mctech/mussel'
  import dayjs from 'dayjs'
  import applyPart from './grid/apply-part.js'
  const TYPE_OPTIONS = [
    { label: '全部', value: 0 },
    { label: '未关联', value: 1 },
    { label: '已关联', value: 2 },
    { label: '已关联当前部位', value: 3 }
  ]
  export default {
    mixins: [applyPart],
    props: {
      selectWbsItem: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
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
        selectedList: []
      }
    },
    computed: {
      ...mapState({
        applyPartList: 'applyPartList',
        unitWorksOptions: 'applyUnitWorksOptions',
        applyEntryWorksOptions: 'applyEntryWorksOptions',
        statMonth: 'statMonth',
        candidateLabels: 'applyPartSpecModel',
        totalApplyPartLength: 'applyPartCount'
      }),
      candidateprojectUnitWorks () {
        this.unitWorksOptions.forEach(item => {
          item.hide = !!this.projectUnitWorkSearchKey && !item.name.includes(this.projectUnitWorkSearchKey)
        })
        return this.unitWorksOptions
      },
      candidateEntryWorks () {
        this.applyEntryWorksOptions.forEach(item => {
          item.hide = !!this.entryWorkSearchKey && !item.name.includes(this.entryWorkSearchKey)
        })
        return this.applyEntryWorksOptions
      },
      beLinkedDisabled () {
        return this.selectWbsItem && this.selectWbsItem.partType === 0 && this.selectedList.length > 0
      },
      cancelLinkedDisabled () {
        return this.selectedList.length > 0 && this.selectedList.filter(item => item.isRelated).length > 0
      },
      newSetLinkedDisabled () {
        return this.selectedList.length > 0 && this.selectedList.filter(item => !item.isRelated).length > 0
      },
      entryWorkPlaceholder () {
        return this.projectUnitWorks.length ? '请选择分部分项' : '请先选择单位工程'
      }
    },
    watch: {
      projectUnitWorks (newValue) {
        if (newValue.length === 0) {
          this.entryWorks = []
          this.applyEntryWorksOptions.forEach(ele => {
            ele.hide = true
          })
        }
      },
      statMonth: {
        handler (val) {
          const { startDate, endDate } = val
          this.startDate = startDate
          this.endDate = endDate
        },
        immediate: true
      },
      offset () {
        this.queryApplyPartList(this.setParams())
      },
      limit (limit) {
        this.offset = 0
        this.queryApplyPartList(this.setParams())
      }
    },
    async mounted () {
      this.queryApplyUnitWorksOption()
      await this.queryApplyPartList(this.setParams())
    },
    methods: {
      ...mapActions([
        'queryApplyPartList',
        'applyPartRelated',
        'applyPartCancelRelated',
        'applyPartAdd',
        'queryApplyUnitWorksOption',
        'queryApplyEntryWorksOption'
      ]),
      selectUnitWorkCategories (item) {
        if (item && this.projectUnitWorks.length > 0) {
          this.queryApplyEntryWorksOption({ unitWorkIds: this.projectUnitWorks })
        }
      },
      selectLabel (item) {},
      async queryApplyPartFunc () {
        if (this.type === 3) {
          if (!this.selectWbsItem) {
            notify('warning', '请先选择算量部位')
            return
          }
        }
        this.offset = 0
        await this.queryApplyPartList(this.setParams())
      },
      async resetApplyPartFunc () {
        this.selectedList = []
        this.projectUnitWorks = []
        this.entryWorks = []
        this.labels = []
        this.type = 1
        this.partSearch = ''
        this.projectUnitWorkSearchKey = ''
        this.entryWorkSearchKey = ''
        this.labelSearchKey = ''
        this.startDate = this.statMonth.startDate
        this.endDate = this.statMonth.endDate
        this.offset = 0
        this.queryApplyPartList(this.setParams())
      },
      // 关联当前部位
      async setLinkedFunc () {
        const relatedArr = this.isRelated(false)
        if (relatedArr.length > 0) {
          this.applyPartCancelRelated({ ticketRefIds: relatedArr }).then((res) => {
            this.selectedList.forEach(item => {
              const isSameSqPart = this.selectWbsItem.partId === item.refProjectEntryWorkId && this.selectWbsItem.specModel === item.refSpecModel
              if (!isSameSqPart) {
                item.isRelated = false
              }
            })
            this.setLink(false)
          })
        } else {
          this.setLink(false)
        }
      },
      // 取消关联设置
      async cancelLinkedFunc () {
        const ticketRefIds = this.applyPartList.filter(item => item.check && item.isRelated).map(item => item.ticketRefId)
        const result = await this.applyPartCancelRelated({ ticketRefIds })
        if (result) {
          this.queryApplyPartFunc()
          notify('success', '取消关联成功')
        }
        this.$emit('changeLinked', result)
      },
      // 设置为新增部位
      async setNewPartLinkedFunc () {
        const relatedArr = this.isRelated(true)
        if (relatedArr.length > 0) {
          this.applyPartCancelRelated({ ticketRefIds: relatedArr }).then((res) => {
            this.selectedList.forEach(item => {
              item.isRelated = false
            })
            this.setLink(true)
          })
        } else {
          this.setLink(true)
        }
      },
      // eslint-disable-next-line complexity
      setParams () {
        const params = {
          offset: this.offset,
          limit: this.limit
        }
        if (this.startDate) {
          Object.assign(params, { startDate: dayjs(this.startDate).format('YYYY-MM-DD') })
        }
        if (this.endDate) {
          Object.assign(params, { endDate: dayjs(this.endDate).format('YYYY-MM-DD') })
        }
        if (this.selectWbsItem && this.type === 3) {
          Object.assign(params, {
            projectEntryWorkId: this.selectWbsItem?.partId,
            partSpecModel: this.selectWbsItem?.specModel
          })
        }
        if (this.projectUnitWorks.length > 0) {
          Object.assign(params, { unitWorkIds: this.projectUnitWorks })
        }
        if (this.entryWorks.length > 0) {
          Object.assign(params, { entryWorkIds: this.entryWorks })
        }
        if (this.labels.length > 0) {
          Object.assign(params, { specModels: this.labels })
        }
        if (this.partSearch) {
          Object.assign(params, { partName: this.partSearch })
        }
        if (this.type !== 0) {
          Object.assign(params, { relatedStatus: this.type })
        }
        return params
      },
      async setLink (isNewSet) {
        const applicationRecordIds = this.applyPartList.filter(item => item.check && !item.isRelated).map(item => item.id)
        const params = {
          partId: this.selectWbsItem?.partId,
          isNewPart: this.selectWbsItem?.partType === 1,
          specModel: this.selectWbsItem?.specModel,
          applicationRecordIds
        }
        if (this.selectWbsItem?.projectUnitWorkId) {
          Object.assign(params, { projectUnitWorkId: this.selectWbsItem.projectUnitWorkId })
        }
        if (this.selectWbsItem?.entryWorkId) {
          Object.assign(params, { entryWorkId: this.selectWbsItem.entryWorkId })
        }
        if (applicationRecordIds.length === 0) return
        let result = false
        if (isNewSet) {
          result = await this.applyPartAdd({ applicationRecordIds })
          notify('success', '设置新增部位成功')
        } else {
          result = await this.applyPartRelated(params)
          notify('success', '关联成功')
        }
        if (result) {
          this.queryApplyPartFunc()
          this.$emit('changeLinked', result)
        }
      },
      isRelated (isNewSet) {
        let arr = []
        if (isNewSet) {
          arr = this.selectedList.filter(item => item.isRelated).map(item => item.ticketRefId)
        } else {
          this.selectedList.forEach(item => {
            const isSameSqPart = this.selectWbsItem.partId === item.refProjectEntryWorkId && this.selectWbsItem.specModel === item.refSpecModel
            if (item.isRelated && !isSameSqPart) {
              arr.push(item.ticketRefId)
            }
          })
        }
        return arr
      },
      changeDate (val) {
        if (val) {
          const { startDate, endDate } = val
          if (startDate && !endDate) {
            // !!
            this.startDate = dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00'
          }
        }
      }
    }
  }
</script>

<style lang="postcss" scoped>
  .apply_part_box {
    height: 100%;
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
