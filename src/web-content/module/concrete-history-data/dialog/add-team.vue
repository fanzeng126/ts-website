<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    keep-alive
    width="425px"
    height="461px"
    :draggable="true"
    title="选择队伍"
    :buttons="buttons"
    @change="change"
    @show="openDlg"
    @buttonclick="onButtonClick">
    <mu-v-box style="height:100%;">
      <kaka-grid
        ref="teamGrid"
        class="mu-absolute-fit"
        :columns="columns"
        :records="records"
        :theme="{highlightBorderColor: 'transparent'}" />
    </mu-v-box>
  </mu-dialog>
</template>

<script>
  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },

    props: {
      visible: Boolean,
      teams: {
        type: Array,
        default: () => {
          return []
        }
      }
    },

    data () {
      return {
        records: [{}]
      }
    },

    computed: {
      buttons () {
        return [
          { caption: '取消', key: 'cancel' },
          { caption: '确定', key: 'ok', buttonType: 'primary' }
        ]
      },

      columns () {
        return [
          { type: 'checkBox', width: 50, readonly: rec => this.teams.includes(rec.id) },
          { field: 'name', caption: '队伍名称', width: 'auto', minWidth: 150 }
        ]
      }
    },

    mounted () {
      this.getTeam()
    },

    methods: {
      change (value) {
        this.$emit('change', value)
      },

      openDlg () {
        if (this.$refs.teamGrid) {
          this.$refs.teamGrid.invalidate()
        }
      },

      onButtonClick ({ key }) {
        const vm = this.$refs.teamGrid

        if (key === 'ok') {
          const teams = vm.getSelectedRecords()
          this.$emit('success', teams)
        }

        this.change(false)
        this.records.forEach(v => (v._selected = false))
        vm.kakaGrid.headerValues.set('_selected', false)
        vm.kakaGrid.invalidate()
      },

      async getTeam () {
        const { dispatch } = this.$store
        const res = await dispatch('getLaborTeam')

        if (res) {
          this.records = res
        }
      }
    }
  }
</script>
