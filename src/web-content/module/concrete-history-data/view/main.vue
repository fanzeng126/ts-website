<template>
  <mu-v-box style="height:100%;padding:16px;">
    <mu-bar class="title margin-b-16">
      <b>混凝土历史数据补录</b>
    </mu-bar>

    <mu-v-box size="1" border-all>
      <mu-bar class="pad-8-16" border-bottom>
        <mu-button
          icon-class="ipm-iconplus-circle"
          caption="添加队伍"
          button-type="primary"
          :disabled="!isEdit"
          @click="openTeamsDlg" />

        <mu-button
          caption="新增标号"
          :disabled="!activeRecord || !isEdit"
          @click="openSpecModelDlg" />

        <mu-icon-button
          icon-class="ipm-icondelete"
          button-type="danger"
          :disabled="delDisabled"
          @click="showDelDlg = true" />

        <mu-space />
        <mu-button
          v-if="isEdit"
          caption="保存"
          button-type="primary"
          style="width:68px;"
          :disabled="!isUpdateData"
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
          :disabled="!editPermission"
          @click="edit" />
      </mu-bar>

      <mu-v-box size="1" class="pad-8-16">
        <empty-panel v-if="!records.length && !isEdit">
          建议您：
          <mu-button
            icon-class="ipm-iconedit"
            caption="编辑"
            button-type="primary"
            :disabled="!editPermission"
            @click="edit" />
        </empty-panel>

        <mu-v-box v-else size="1">
          <mu-bar v-if="showTip" class="tips">
            <mu-icon
              icon-class="ipm-icontime-circle-fill"
              class="time-circle" />
            提示：补录数据截止使用混凝土用料申请小程序之日。

            <mu-space />
            <mu-icon
              icon-class="ipm-iconclose"
              class="close-icon"
              @click="showTip = false" />
          </mu-bar>

          <mu-v-box size="1">
            <kaka-grid
              ref="grid"
              class="mu-absolute-fit"
              key-field="id"
              parent-key-field="parentId"
              :columns="columns"
              :records="records"
              :check-cascade="false"
              @cellselect="selectCell"
              @cellchange="gridChange"
              @cellcheck="selectIems"
              @celluncheck="selectIems"
              @load="load"
              @paste="pasteData" />
          </mu-v-box>
        </mu-v-box>
      </mu-v-box>
    </mu-v-box>

    <add-team
      v-model="showAddTeam"
      :teams="selectTeam"
      @success="addTeams" />
    <add-spec-model
      v-model="showAddModel"
      :spce-model="selectSpecModel"
      @success="addSpecModel" />
    <cancel-dlg
      v-model="showCancelDlg"
      @cancelEdit="showCancelDlg = false"
      @exit="noSaveSignout"
      @save="saveSignout" />

    <mu-dialog
      v-model="showDelDlg"
      model-control="external"
      keep-alive
      width="415px"
      height="240px"
      :draggable="true"
      title="删除提示"
      :buttons="buttons"
      @buttonclick="onButtonClick">
      <mu-v-box
        text-align="center"
        justify-content="center"
        style="height:100%;">
        将删除当前已选所有补录数据，是否确认删除？
      </mu-v-box>
    </mu-dialog>
  </mu-v-box>
</template>

<script>
  import EmptyPanel from '../../../components/empty-panel.vue'
  import AddTeam from '../dialog/add-team.vue'
  import AddSpecModel from '../dialog/add-spec-model.vue'
  import CancelDlg from '../dialog/dlg-cancel.vue'
  import { paste } from '../../../utils/paste'

  import { notify } from '@mctech/mussel'
  import { fixedNumber } from '@mctech/biz-data-utils'

  export default {
    components: {
      EmptyPanel,
      AddTeam,
      AddSpecModel,
      CancelDlg
    },

    inject: ['context'],

    data () {
      return {
        showAddTeam: false,
        showAddModel: false,
        showCancelDlg: false,
        showDelDlg: false,
        showTip: true,
        localId: -2,

        recordsJson: '',
        backupRecords: [],
        records: [],

        activeRecord: null,
        isEdit: false,
        selectSpecModel: [],
        selectTeam: [],

        isUpdateData: false,
        unSelectedData: true,

        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,

        pasteColumns: [
          { fieldName: 'totalDesignQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'totalRequiredQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'totalActualQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'yearDesignQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'yearRequiredQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'yearActualQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'monthDesignQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'monthRequiredQuantity', dataType: 'number', decimal: 2 },
          { fieldName: 'monthActualQuantity', dataType: 'number', decimal: 2 }
        ]
      }
    },

    computed: {
      editPermission () {
        return this.context.permissions.includes('concrete-history-data-edit')
      },

      delDisabled () {
        return (!this.isEdit) || !this.editPermission || this.unSelectedData
      },

      buttons () {
        return [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ]
      },

      columns () {
        return [
          { caption: '选择', type: 'checkBox', headerType: null, width: 48, minWidth: 48, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit },
          { field: 'specModel', caption: '队伍/混凝土标号', type: 'tree', headerStyle: { textAlign: 'center' }, width: 'auto', minWidth: 200, style: rec => this.setStyle(rec), readonly: true },
          {
            caption: '开累',
            columns: [
              { field: 'totalDesignQuantity', type: 'number', caption: '设计量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'totalRequiredQuantity', type: 'number', caption: '应耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'totalActualQuantity', type: 'number', caption: '实耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 }
            ]
          },
          {
            caption: `${this.year}年`,
            columns: [
              { field: 'yearDesignQuantity', type: 'number', caption: '设计量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'yearRequiredQuantity', type: 'number', caption: '应耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'yearActualQuantity', type: 'number', caption: '实耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 }
            ]
          },
          {
            caption: `${this.year}年${this.month}月`,
            columns: [
              { field: 'monthDesignQuantity', type: 'number', caption: '设计量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'monthRequiredQuantity', type: 'number', caption: '应耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 },
              { field: 'monthActualQuantity', type: 'number', caption: '实耗量', align: 'center', minWidth: 80, style: rec => this.setStyle(rec), readonly: rec => !this.isEdit || rec.parentId === -1 }
            ]
          }
        ]
      }
    },

    watch: {
      isEdit (val) {
        if (!val) {
          this.isUpdateData = false
        }
      }
    },

    async created () {
      await this.getAnalysisHistory()
    },

    methods: {
      // 新增队伍
      addTeams (teams) {
        teams.forEach(v => {
          this.backupRecords.push({ id: v.id, specModel: v.name, parentId: -1 })
        })

        this.setRecords(true)
      },

      setRecords (val) {
        const data = this.backupRecords
          .filter(v => !v.isRemoved)

        this.records.splice(0)
        this.records.push(...data)

        if (!val) {
          this.isUpdateData = true
        }
      },

      selectCell (obj, selected, vm) {
        const { row } = obj
        if (selected) {
          this.activeRecord = vm.kakaGrid.getRowRecord(row)
          vm.invalidate()
        }
      },

      setStyle (rec) {
        if (rec.id === this.activeRecord?.id) {
          return { bgColor: '#F4FBFF' }
        }
      },

      // 新增标号
      addSpecModel (models) {
        const {
          id,
          parentId,
          specModel,
          teamName: tName
        } = this.activeRecord
        const teamId = parentId > 0 ? parentId : id
        const teamName = parentId > 0 ? tName : specModel

        const vm = this.$refs.grid
        models.forEach(v => {
          this.localId--
          this.backupRecords.push({
            id: this.localId,
            teamId,
            teamName,
            specModel: v.name,
            parentId: teamId
          })
          this.$nextTick(() => vm.invalidate())
        })

        this.setRecords()
        this.$nextTick(() => {
          const index = vm.kakaGrid.dataSource.expandToKey(teamId)
          vm.kakaGrid.dataSource.expand(index, true)
        })
      },

      async getAnalysisHistory () {
        const { dispatch } = this.$store
        const res = await dispatch('getAnalysisHistory')

        if (res) {
          this.backupRecords.splice(0)
          this.backupRecords.push(...res)
          this.recordsJson = JSON.stringify(this.backupRecords)
          this.setRecords(true)
          this.isUpdateData = false
          const item = res.find(v => v.parentId > 0)
          if (item) {
            this.year = item.year
            this.month = item.month
          } else {
            await this.setInitDate()
          }

          this.$nextTick(() => {
            const vm = this.$refs.grid
            if (vm && vm.kakaGrid) {
              this.$refs.grid.invalidate()
            }
          })
        }
      },

      async save () {
        const createData = []
        const updateData = []
        const deleteData = []

        this.backupRecords.forEach(v => {
          if (v.id < 0 && !v.isRemoved) {
            createData.push({ ...v, year: this.year, month: this.month })
          }

          if (v.id > 0 && v.isRemoved) {
            deleteData.push(v.id)
          }

          if (v.id > 0 && v.isUpdate) {
            updateData.push(v)
          }
        })

        const body = { createData, updateData, deleteData }
        const { dispatch } = this.$store
        const res = await dispatch('updateAnalysisHistory', body)

        if (res) {
          this.getAnalysisHistory()
          notify('success', '保存成功')
        }
      },

      gridChange (data, vm) {
        const { field, record, value } = data
        if (field === '_selected') {
          this.unSelectedData = !vm.getSelectedRecords().length
          return
        }
        if (record.id > 0 && record.parentId > 0) {
          record.isUpdate = true
          this.isUpdateData = true
        }

        const item = this.backupRecords.find(v => v.id === record.id)
        if (item) {
          item[field] = fixedNumber.fixedAmount(value)
        }
      },

      deleteRocords () {
        const vm = this.$refs.grid
        const records = vm.getSelectedRecords()
        const dlIds = records.map(v => v.id)
        this.backupRecords.forEach(v => {
          if (dlIds.includes(v.id)) {
            v.isRemoved = true
          }
        })

        this.setRecords()
        this.unSelectedData = true
      },

      openTeamsDlg () {
        this.selectTeam = this.backupRecords
          .filter(v => v.parentId < 0 && !v.isRemoved)
          .map(v => v.id)

        this.showAddTeam = true
      },

      openSpecModelDlg () {
        const id = this.activeRecord.parentId === -1
          ? this.activeRecord.id
          : this.activeRecord.parentId

        this.selectSpecModel = this.backupRecords
          .filter(v => v.parentId === id && !v.isRemoved)
          .map(v => v.specModel)

        this.showAddModel = true
      },

      edit () {
        this.isEdit = true
        this.$nextTick(() => {
          const vm = this.$refs.grid
          if (vm && vm.kakaGrid) {
            this.$refs.grid.invalidate()
          }
        })
      },

      cancel () {
        const val = this.backupRecords.some(v => {
          return (v.id < 0 && !v.isRemoved) ||
            (v.id > 0 && v.isRemoved) ||
            v.isUpdate
        })

        if (val) {
          this.showCancelDlg = true
        } else {
          this.noSaveSignout()
        }
      },

      // 不保存并退出
      noSaveSignout () {
        const arr = JSON.parse(this.recordsJson)
        this.backupRecords.splice(0)
        this.backupRecords.push(...arr)

        this.setRecords()
        this.showCancelDlg = false
        this.isEdit = false
        this.$refs.grid.invalidate()
      },

      // 保存并退出
      async saveSignout () {
        await this.save()
        this.showCancelDlg = false
        this.isEdit = false
        this.$refs.grid.invalidate()
      },

      onButtonClick ({ key }) {
        if (key === 'ok') {
          this.deleteRocords()
        }

        this.showDelDlg = false
      },

      selectIems (data, vm) {
        const { record, value, field } = data
        if (record.parentId < 0) {
          this.backupRecords.forEach(v => {
            if (v.parentId === record.id) {
              v[field] = value
            }
          })
        }

        if (record.parentId > 0 && !value) {
          const parentNode = this.backupRecords
            .find(v => v.id === record.parentId && !v.isRemoved)
          parentNode[field] = value
        }

        this.$nextTick(() => vm.invalidate())
      },

      load (vm) {
        this.$nextTick(() => {
          vm.invalidate()
          vm.kakaGrid.dataSource.expandAll()
        })
      },

      pasteData (data) {
        const grid = this.$refs.grid.kakaGrid
        const row = grid.selection.range.start.row

        if (!this.isEdit || row < 2) {
          return
        }
        const res = paste(
          data,
          grid,
          this.pasteColumns,
          2
        )

        res.forEach((v, k) => {
          const rec = grid.getRowRecord(row + k)
          if (rec && rec.parentId > 0) {
            Object.assign(rec, v, { isUpdate: true })
          }
        })

        this.isUpdateData = true
        this.$nextTick(() => grid.invalidate())
      },

      async setInitDate () {
        const res = await this.$http.get(
          'services/org-params',
          { params: { paramNames: 'sm-stat-cycle' } }
        )

        if (res) {
          const { monthEnd, yearEnd } = res['sm-stat-cycle']
          const day = new Date().getDate()
          const month = new Date().getMonth() + 1
          const year = new Date().getFullYear()
          const entDay = month === 12 ? yearEnd : monthEnd

          this.month = day > entDay
            ? month === 12
              ? 1
              : month + 1
            : month

          this.year = month === 12 && day > yearEnd ? year + 1 : year
        }
      }
    }
  }
</script>

<style scoped>
  .title {
     font-size: 16px;
  }

  .pad-16 {
    padding: 16;
  }

  .pad-8-16 {
    padding: 8px 16px;
  }

  .margin-b-16 {
    margin-bottom: 16px;
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
