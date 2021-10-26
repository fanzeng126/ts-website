<template>
  <mu-v-box class="pad-16" style="height:100%;">
    <mu-bar class="f-16 margin-b-16"><b>设置</b></mu-bar>

    <mu-v-box size="1" border-all>
      <mu-bar
        class="pad-8-16"
        border-bottom>
        <b>参数设置</b>

        <mu-space />

        <mu-button
          v-if="isEdit"
          class="margin-r-8"
          caption="取消"
          @click="cancel" />

        <mu-button
          v-if="isEdit"
          button-type="primary"
          caption="保存"
          @click="save" />

        <mu-button
          v-else
          button-type="primary"
          caption="编辑"
          :disabled="!editPermission"
          @click="isEdit = true" />
      </mu-bar>

      <mu-h-box
        size="1"
        flex-wrap
        class="pad-16"
        justify-content="space-between">
        <div class="flex-item" border-all>
          <div class="title pad-16" border-bottom>
            01. 月度台帐周期设置
          </div>
          <div class="content pad-8-16">
            <span class="margin-r-8"><b>月度台帐周期:</b> 月截止日期</span>
            <mu-combo-box
              v-model="monthEnd"
              :clearable="false"
              :disabled="!isEdit"
              :options="days" />
          </div>
        </div>

        <div class="flex-item" border-all>
          <div class="title pad-16" border-bottom>
            02. 年度台帐周期设置
          </div>
          <div class="content pad-8-16">
            <span class="margin-r-8"><b>年度台帐周期:</b> 年末日期</span>
            <mu-combo-box
              v-model="yearEnd"
              :clearable="false"
              :disabled="!isEdit"
              :options="days" />
          </div>
        </div>
      </mu-h-box>
    </mu-v-box>
  </mu-v-box>
</template>

<script>
  export default {
    inject: ['context'],

    data () {
      return {
        monthEnd: '',
        yearEnd: '',
        isEdit: false
      }
    },

    computed: {
      days () {
        return Array.from({ length: 31 }, (v, k) => ({ label: k + 1 + '日', value: k + 1 }))
      },

      editPermission () {
        return this.context.permissions.includes('cmb/concrete-basic-setting-view')
      }
    },

    mounted () {
      this.getSettingData()
    },

    methods: {
      cancel () {
        this.getSettingData()
      },

      async save () {
        const body = [{
          paramName: 'sm-stat-cycle',
          paramValue: {
            yearEnd: this.yearEnd,
            monthEnd: this.monthEnd,
            weekStart: 6,
            splitWeekAtMonthEnd: true,
            mergeWeek: false,
            mergeWeekTh: 3,
            weekBelongMode: 'week_start'
          }
        }]
        const res = await this.$http.put(
          'services/org-params',
          body
        )

        if (res) {
          this.isEdit = false
        }
      },

      // 获取参数设置
      async getSettingData () {
        const res = await this.$http.get(
          'services/org-params',
          { params: { paramNames: 'sm-stat-cycle' } }
        )

        if (res) {
          const { monthEnd, yearEnd } = res['sm-stat-cycle']
          this.yearEnd = yearEnd
          this.monthEnd = monthEnd
          this.isEdit = false
        }
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
  }

  [justify-content="space-between"] {
    justify-content: space-between
  }
</style>
