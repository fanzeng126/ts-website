<template>
  <mu-v-box
    class="mu-absolute-fit"
    content-spacing
    border-all>
    <div class="mu-module-title">
      地材超节分析
    </div>
    <mu-v-box size="1">
      <mu-h-box size="1">
        <mu-v-box
          :size="isOutdent ? '253px' : '50px'"
          border-all>
          <mu-bar
            border-bottom>
            <mu-bar v-show="isOutdent"
              class="mu-bar-pad-right">
              <mu-button
                icon-class="ipm-iconplus-circle"
                caption="新增统计周期"
                button-type="primary"
                @click="addStatPeriod"
              />
              <mu-space />
              <mu-icon-button
                icon-class="ipm-icondelete"
                :disabled="editDisabled"
                button-type="danger"
                @click="delStatPeriod" />
            </mu-bar>
            <mu-space v-show="isOutdent" />
            <div class="outOrinDent"
              @click="isOutdent = !isOutdent">
              <span :class="{'ipm-iconoutdent': isOutdent, 'ipm-iconindent': !isOutdent}" />
            </div>
          </mu-bar>
          <mu-v-box
            v-show="isOutdent"
            v-mussel-scrollbar
            class="stat-period"
            size="1">
            <cus-expander
              v-for="item in records"
              :key="`${item[0]}_${new Date()}`"
              class="mu-bordered"
              :expanded="true"
              :title="`${item[0]}`">
              <mu-list-item
                v-for="ele in item[1]"
                :key="ele.id"
                :class="{ active: activePeriodId === ele.id}"
                @click="selectStatPeriod(ele)"
              >
                {{ ele.value }}
              </mu-list-item>
            </cus-expander>
          </mu-v-box>
        </mu-v-box>
        <mu-v-box size="auto" border-all>
          <mu-h-box>
            <mu-bar size="50%" class="pad-16"
              border-bottom border-right>
              <span>项目名称：{{ orgShortName }}</span>
            </mu-bar>
            <mu-bar size="50%" class="pad-16"
              border-bottom>
              <span>数据截至时间：{{ activePeriodEndDate }}</span>
            </mu-bar>
          </mu-h-box>
          <mu-bar class="mu-bar-pad" border-bottom>
            <mu-button
              check-type="primary"
              :disabled="disabledSync"
              @click="syncDesignData">
              同步设计量
            </mu-button>
            <mu-checkbox
              v-model="inventorActual"
              check-type="primary"
              @change="changeInventor">
              盘点实耗量
            </mu-checkbox>
            <mu-checkbox
              v-model="machineActual"
              check-type="primary"
              @change="changeMachine">
              机楼实耗量
            </mu-checkbox>
            <span>砂石统计单位：</span>
            <mu-radio-group
              v-model="unit">
              <mu-radio option="m³">
                m³
              </mu-radio>
              <mu-radio option="t">
                t
              </mu-radio>
            </mu-radio-group>
            <mu-space />
            <mu-button
              v-if="isEdit"
              caption="保存"
              button-type="primary"
              style="width:68px;"
              @click="save" />
            <mu-button
              v-if="isEdit"
              caption="退出编辑"
              @click="cancel" />
            <mu-button
              v-else
              icon-class="ipm-iconedit"
              button-type="primary"
              :disabled="editDisabled"
              caption="编辑"
              @click="edit" />
            <mu-button
              icon-class="ipm-iconexport"
              caption="导出Excel"
              @click="exportExcel" />
          </mu-bar>
          <mu-v-box size="1">
            <div
              id="analysisGrid"
              ref="analysisGrid"
              class="mu-absolute-fit" />
          </mu-v-box>
        </mu-v-box>
      </mu-h-box>
    </mu-v-box>
    <mu-dialog
      :visible="visible"
      model-control="external"
      width="480px"
      height="240px"
      class="selectPeriod"
      :draggable="false"
      title="选择周期"
      :buttons="buttons"
      @change="closeDialog"
      @buttonclick="onButtonClick">
      <mu-h-box style="align-items: center;
        padding: 35px 45px;">
        <span>选择周期：</span>
        <mu-date-editor
          v-model="startDate"
          :range-start="rangeStartDate"
          style="width: 140px"
          format="yyyy年MM月dd" />
        <span>~</span>
        <mu-date-editor
          v-model="endDate"
          :range-start="rangeStartDate"
          style="width: 140px"
          format="yyyy年MM月dd" />
      </mu-h-box>
    </mu-dialog>
    <cmp-excel-file ref="excel" />
    <cancel-dlg
      v-model="showCancelDlg"
      @cancelEdit="showCancelDlg = false"
      @exit="noSaveSignout"
      @save="saveSignout" />
    <design-quantity-dlg
      :id="activePeriodId"
      v-model="showDetailDlg"
      :unit="unit"
      @designQuantity="designQuantity"
      @cancelEdit="showDetailDlg = false"
      @exit="showDetailDlg = false" />
  </mu-v-box>
</template>
<script>
  import cloneDeep from 'lodash.clonedeep'
  import { mapActions } from 'vuex'
  import { notify, warn } from '@mctech/mussel'
  import dayjs from 'dayjs'
  import analysisMaterial from '../grid/analysis-material.js'
  import CancelDlg from '../../../components/dlg-cancel.vue'
  import DesignQuantityDlg from '../compontent/designQuantityDetail.vue'

  export default {
    inject: ['application'],
    components: {
      CancelDlg,
      DesignQuantityDlg
    },
    mixins: [analysisMaterial],
    data () {
      return {
        permitAddStatPeriod: false,
        isOutdent: true,
        activePeriod: null,
        records: [],
        inventorActual: true,
        machineActual: false,
        visible: false,
        startDate: null,
        endDate: null,
        unit: 'm³',
        buttons: [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ],
        isEdit: false,
        showCancelDlg: false,
        showDetailDlg: false,
        copyAnalysisRecords: [],
        disabledSync: true,
        disabledSyncArr: [],
        analyseDataMap: null// 存储材料设计量
      }
    },
    computed: {
      activePeriodId () {
        return this.activePeriod?.id
      },
      activePeriodEndDate () {
        if (this.activePeriod && 'endDate' in this.activePeriod) {
          return dayjs(this.activePeriod.endDate).format('YYYY年MM月DD日')
        } else {
          return ''
        }
      },
      rangeStartDate () {
        if (this.activePeriod && 'endDate' in this.activePeriod) {
          return new Date(this.activePeriod.endDate)
        } else {
          return null
        }
      },
      editDisabled () {
        return !this.activePeriod?.isLast
      },
      orgShortName () {
        return this.application.context.orgShortName
      }
    },
    watch: {
      async unit (val) {
        if (this.activePeriod && val !== this.activePeriod.unit) {
          await this.updateStatPeriod(val)
          this.activePeriod.unit = val
        }
      },
      activePeriod (val) {
        if (val) {
          this.unit = val.unit
          this.startDate = dayjs(val.endDate).add(1, 'day').format('YYYY-MM-DD')
          this.endDate = dayjs(val.endDate).add(1, 'month').format('YYYY-MM-DD')
          this.getMaterialAnalyseAndSyncDesignQuantityData(this.activePeriodId)
        } else {
          this.unit = 'm³'
          this.startDate = null
          this.endDate = null
          this.analysisRecords = []
          this.isEdit = false
          this.copyAnalysisRecords = []
          this.disabledSync = true
          this.disabledSyncArr = []
          this.analyseDataMap = null
          this.getOrgParams().then(res => {
            const { startDate = null, endDate = null } = res
            this.startDate = startDate
            this.endDate = endDate
          })
          this.$nextTick(() => {
            this.analysisGrid.invalidate()
          })
        }
      }
    },
    created () {
      this.getOrgParams().then(res => {
        const { startDate = null, endDate = null } = res
        this.startDate = startDate
        this.endDate = endDate
      })
      this.getConcreteTheoreticalMixerRatio().then(res => {
        this.permitAddStatPeriod = !!res.length
      })
      this.getStatPeriod()
    },
    methods: {
      ...mapActions([
        'addConcreteStatPeriod',
        'getStatMixerRatio',
        'getConcreteStatPeriod',
        'deleteConcreteStatPeriod',
        'updateConcreteStatPeriod',
        'getMaterialAnalyseDesignQuantity',
        'addConcreteMaterialAnalyse',
        'updateConcreteMaterialAnalyse',
        'getConcreteMaterialAnalyse',
        'getConcreteTheoreticalMixerRatio',
        'getMaterialAnalyseAndSyncDesignQuantity',
        'syncDesignQuantity',
        'getOrgParams'
      ]),
      async updateStatPeriod (unit) {
        if (this.activePeriodId) {
          await this.updateConcreteStatPeriod({
            id: this.activePeriodId,
            unit
          })
          this.getAnalysis(this.activePeriodId)
        }
      },

      // 获取统计周期列表
      async getStatPeriod () {
        this.records = await this.getConcreteStatPeriod()
        if (this.records.length) {
          this.activePeriod = this.records[0][1][0]
        } else {
          this.activePeriod = null
        }
      },
      // 选择时间周期
      selectStatPeriod (item) {
        if (item.id !== this.activePeriodId) {
          this.activePeriod = item
        }
      },
      // 新增周期
      addStatPeriod () {
        if (this.permitAddStatPeriod) {
          if (!this.activePeriodId || this.analysisRecords[0]?.id) {
            this.visible = true
          } else {
            notify('warning', '请先设置本期盘点量')
          }
        } else {
          notify('warning', '请先设置理论配合比台账')
        }
      },
      // 删除统计周期
      delStatPeriod () {
        warn('确定删除此周期吗?', async btn => {
          if (btn === 'ok') {
            const result = await this.deleteConcreteStatPeriod({ id: this.activePeriodId })
            if (result) {
              this.getStatPeriod()
              notify('success', '删除成功')
            }
          }
        })
      },
      // 关闭新增弹窗
      closeDialog (val) {
        this.visible = val
      },
      async onButtonClick ({ key }) {
        if (key === 'ok') {
          if (!this.startDate || !this.endDate) {
            notify('warning', '当前无数据，建议先选择新增日期')
            return
          }
          if (this.startDate > this.endDate) {
            notify('warning', '结束时间不能小于快开始时间')
            return
          }
          const isAdd = await this.addConcreteStatPeriod({
            startDate: dayjs(this.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(this.endDate).format('YYYY-MM-DD'),
            unit: this.unit
          })
          if (isAdd) {
            this.getStatPeriod()
          }
          this.visible = false
        }
        this.visible = false
      },
      async getMaterialAnalyseAndSyncDesignQuantityData (id) {
        this.analysisRecords = []
        if (id) {
          const {
            analyseData,
            disabledSyncArr,
            analyseDataMap
          } = await this.getMaterialAnalyseAndSyncDesignQuantity({
            id,
            unit: this.unit
          })

          this.disabledSyncArr = disabledSyncArr
          this.disabledSync = !disabledSyncArr.length
          this.analysisRecords = analyseData
          this.analyseDataMap = analyseDataMap
        }
        this.copyAnalysisRecords = cloneDeep(this.analysisRecords)
        this.$nextTick(() => {
          this.analysisGrid.invalidate()
        })
      },
      designQuantity (val) {
        this.disabledSyncArr = this._judgeMaterialData(this.analyseDataMap, val)
        this.disabledSync = !this.disabledSyncArr.length
      },
      async getAnalysis (id) {
        this.analysisRecords = []
        if (id) {
          this.analysisRecords = await this.getConcreteMaterialAnalyse({ id, unit: this.unit })
        }
        this.copyAnalysisRecords = cloneDeep(this.analysisRecords)
        this.$nextTick(() => {
          this.analysisGrid.invalidate()
        })
      },
      edit () {
        this.isEdit = true
        this.$nextTick(() => {
          this.analysisGrid.invalidate()
        })
      },
      async save () {
        const concreteStatPeriodId = this.activePeriodId
        const ids = this.analysisRecords.filter(item => item.id)
        let isFinsh = null
        if (ids.length > 0) {
          isFinsh = await this.updateConcreteMaterialAnalyse({ data: this.analysisRecords })
        } else {
          isFinsh = await this.addConcreteMaterialAnalyse({ data: this.analysisRecords, concreteStatPeriodId })
        }
        if (isFinsh) {
          notify('success', ids.length > 0 ? '新增成功' : '编辑成功')
          this.isEdit = false
          this.getAnalysis(this.activePeriodId)
        }
      },
      cancel () {
        const modifyData = this.analysisRecords.filter(item => item.isModify)
        if (modifyData.length > 0) {
          this.showCancelDlg = true
        } else {
          this.noSaveSignout()
        }
      },
      noSaveSignout () {
        this.showCancelDlg = false
        this.isEdit = false

        this.analysisRecords = cloneDeep(this.copyAnalysisRecords)
        this.analysisGrid.invalidate()
      },
      saveSignout () {
        this.showCancelDlg = false
        this.save()
      },
      async syncDesignData () {
        if (!this.disabledSync) {
          const { id, isLast = false, unit, year } = this.activePeriod
          if (this.disabledSyncArr[0]?.id) {
            const changeData = this.disabledSyncArr.map(item => {
              return {
                id: item.id,
                periodDesignQuantity: item.periodDesignQuantity,
                yearDesignQuantity: item.yearDesignQuantity,
                totalDesignQuantity: item.totalDesignQuantity
              }
            })
            const res = await this.syncDesignQuantity({
              data: changeData,
              statId: id,
              year,
              isLast,
              unit,
              periodDesignChangeQuantity: this.disabledSyncArr
            })
            if (res) {
              notify('success', '同步数据成功')
            }
          }
          this.getMaterialAnalyseAndSyncDesignQuantityData(this.activePeriodId)
        }
      },
      exportExcel () {
        if (this.activePeriodId) {
          const { startDate, endDate, unit } = this.activePeriod
          this.$refs.excel.export({
            type: 'concreteMaterialAnalysis',
            id: this.activePeriodId, // 周期id
            projectName: this.orgShortName,
            statDate: `${startDate}至${endDate}`, // 周期开始截止时间
            unit // 周期内单位
          }, this.$http)
        }
      }
    }
  }
</script>
<style lang="postcss" scoped>
  .mu-bar-pad-right {
    padding: 8px 0px 8px 16px;
  }
  #analysisGrid {
    height: 100%;
    padding: 16px 0 0 16px;
  }
  .outOrinDent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-left: 1px solid #EBECF0;
    span {
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  .mu-checkbox {
    & + .mu-checkbox {
      margin-left: 8px;
    }
    & > input {
      &:checked + .mu-checkbox_fake {
        background: #008cd6;
          &:before {
            border-color: #fff;
          }
      }
    }
  }
</style>
