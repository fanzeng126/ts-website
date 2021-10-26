<template>
  <mu-v-box
    class="mu-absolute-fit"
    content-spacing
    border-all>
    <div class="mu-module-title">
      理论配合比台账
    </div>
    <mu-v-box size="1" border-all>
      <mu-bar class="mu-bar-pad" border-bottom>
        <mu-button
          icon-class="ipm-iconplus-circle"
          caption="新增设计等级"
          button-type="primary"
          :disabled="isEdit"
          @click="openDesignGradeDlg" />
        <mu-button button-type="normal"
          :disabled="isEdit"
          @click="showRawMaterial = true">
          原材料仓关联
        </mu-button>
        <mu-icon-button
          icon-class="ipm-icondelete"
          button-type="danger"
          :disabled="(delDisable && isEdit) || !isEdit"
          @click="deleteRecord" />
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
          caption="编辑"
          :disabled="!records.length"
          @click="edit" />
      </mu-bar>
      <mu-v-box size="1" class="pad-8-16">
        <empty-panel v-if="!records.length && !isEdit">
          建议新增设计等级
        </empty-panel>
        <mu-v-box v-else size="1">
          <mu-bar v-if="showTip" class="tips">
            <mu-icon
              icon-class="ipm-icontime-circle-fill"
              class="time-circle" />
            提示：配合比应考虑砂石含水率，当含水率发生变化，建议更新配合比后再做地材节超分析。
            <mu-space />
            <mu-icon
              icon-class="ipm-iconclose"
              class="close-icon"
              @click="showTip = false" />
          </mu-bar>
          <div class="table_title mu-module-title">
            混凝土配合比试验台账（理论）
          </div>
          <mu-v-box size="1">
            <kaka-grid
              ref="mixRecordGrid"
              class="mu-absolute-fit"
              :columns="columns"
              :records="records"
              :theme="theme"
              @cellselect="selectCell"
              @cellchange="gridChange"
              @cellcheck="selectItems"
              @celluncheck="selectItems"
              @checkall="selectAllItems"
              @uncheckall="selectAllItems"
              @load="load"
              @paste="pasteData" />
          </mu-v-box>
        </mu-v-box>
      </mu-v-box>
    </mu-v-box>

    <add-design-grade
      v-model="showAddGrade"
      :spce-model="selectSpecModel"
      @success="addGradeFn" />
    <raw-material-relate
      v-model="showRawMaterial"
    />
    <cancel-dlg
      v-model="showCancelDlg"
      @cancelEdit="showCancelDlg = false"
      @exit="noSaveSignout"
      @save="saveSignout" />
  </mu-v-box>
</template>
<script>
  import { mapActions } from 'vuex'
  import { notify, warn } from '@mctech/mussel'
  import round from 'lodash.round'
  import EmptyPanel from '../../../components/empty-panel.vue'
  import CancelDlg from '../../../components/dlg-cancel.vue'
  import AddDesignGrade from '../compontent/add-design-grade.vue'
  import RawMaterialRelate from '../compontent/raw-material-relate.vue'
  import mixRecord from '../grid/mix-record.js'

  export default {
    components: {
      EmptyPanel,
      AddDesignGrade,
      RawMaterialRelate,
      CancelDlg
    },
    mixins: [mixRecord],
    data () {
      return {
        isEdit: false,
        records: [],
        copyRecords: [],
        selectSpecModel: [],
        showAddGrade: false,
        showRawMaterial: false,
        activeRecord: null,
        isModify: false,
        showCancelDlg: false,
        showTip: true,
        selectedList: []
      }
    },
    computed: {
      theme () {
        return {
          highlightBorderColor: (args) => {
            if (args.row < 2 || args.col < 3) {
              return 'transparent'
            } else {
              return '#5E9ED6'
            }
          }
        }
      },
      delDisable () {
        return this.selectedList.length === 0
      }
    },
    created () {
      this.getList()
    },
    methods: {
      ...mapActions([
        'getMixerNoAndMaterialName',
        'setMaterialMixingStationRelation',
        'getConcreteTheoreticalMixerRatio',
        'addConcreteTheoreticalMixerRatio',
        'deleteConcreteTheoreticalMixerRatio',
        'updateConcreteTheoreticalMixerRatio'
      ]),
      edit () {
        this.isEdit = true
        this.$nextTick(() => {
          const vm = this.$refs.mixRecordGrid
          if (vm && vm.kakaGrid) {
            this.$refs.mixRecordGrid.invalidate()
          }
        })
      },
      async save () {
        const result = await this.updateConcreteTheoreticalMixerRatio(this.records)
        if (result) {
          this.isEdit = false
          this.getList()
          this.$nextTick(() => {
            const vm = this.$refs.mixRecordGrid
            if (vm && vm.kakaGrid) {
              this.$refs.mixRecordGrid.invalidate()
            }
          })
          notify('success', '编辑成功')
        }
      },
      cancel () {
        const modifyData = this.records.filter(item => item.isModify)
        if (modifyData.length > 0) {
          this.showCancelDlg = true
        } else {
          this.noSaveSignout()
        }
      },
      openDesignGradeDlg () {
        this.selectSpecModel = this.records.map(item => item.specModel)
        this.showAddGrade = true
      },
      formatField (obj) {
        const keys = Object.keys(obj)
        const invaKays = ['specModel', 'slump', 'concreteType', 'remark']
        keys.forEach(v => {
          if (!invaKays.includes(v)) {
            obj[v] = (obj[v] || obj[v] === 0) ? round(obj[v], 2) : ''
          }
        })
        return obj
      },
      async getList () {
        this.records = await this.getConcreteTheoreticalMixerRatio()
        this.records.forEach(e => {
          e = this.formatField(e)
        })
        this.copyRecords = JSON.stringify(this.records)
      },
      async addGradeFn (models) {
        const data = models.filter(l => !this.selectSpecModel.includes(l.name))
        const isAdd = await this.addConcreteTheoreticalMixerRatio(data.map(l => l.name))
        if (isAdd) {
          this.isEdit = true
          this.getList()
        }
      },
      noSaveSignout () {
        this.showCancelDlg = false
        this.isEdit = false

        this.records = JSON.parse(this.copyRecords)
        this.$refs.mixRecordGrid.invalidate()
      },
      saveSignout () {
        this.showCancelDlg = false
        this.save()
      },
      deleteRecord () {
        warn('确定删除此设计等级吗?', async btn => {
          if (btn === 'ok') {
            const vm = this.$refs.mixRecordGrid
            const records = vm.getSelectedRecords()
            const ids = records.map(v => v.id)
            const result = await this.deleteConcreteTheoreticalMixerRatio(ids)
            if (result) {
              this.records = this.records.filter(l => !ids.includes(l.id))
              this.$refs.mixRecordGrid.invalidate()
              const data = JSON.parse(this.copyRecords).filter(l => !ids.includes(l.id))
              this.copyRecords = JSON.stringify(data)
              notify('success', '删除成功')
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  .table_title {
    height: 46px;
    text-align: center;
    line-height: 48px;
    background: #f5f5f5;
    border: 1px solid #ebecf0;
  }
  .pad-8-16 {
    padding: 8px 16px;
  }
  .tips {
    background: #ffecd3;
    padding: 8px;
    margin-bottom: 8px;
  }
  .time-circle {
    color: #f4af61;
    font-size: 16px;
    margin-right: 4px;
    vertical-align: text-bottom;
  }

  .close-icon {
    cursor: pointer;
  }
</style>
