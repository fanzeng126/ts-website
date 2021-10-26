<template>
  <mu-v-box
    class="mu-absolute-fit"
    content-spacing>
    <div class="mu-module-title">
      混凝土部位关联
    </div>
    <mu-tabs
      class="tab-box"
      model-control="external"
      :active-tab="activeTabName"
      :tab-position="pos"
      :tab-style="style"
      @change="onTabChange">
      <mu-tab-panel
        v-if="show"
        name="非隧道工程"
        size="auto">
        <nonTunnelProject />
      </mu-tab-panel>
      <mu-tab-panel
        v-if="show"
        name="隧道工程"
        size="auto">
        <tunnelProject />
      </mu-tab-panel>
    </mu-tabs>
  </mu-v-box>
</template>
<script>
  import dayjs from 'dayjs'
  import nonTunnelProject from './non-tunnel-project/non-tunnel-main.vue'
  import tunnelProject from './tunnel-project/tunnel-main.vue'
  export default {
    components: {
      nonTunnelProject,
      tunnelProject
    },
    data () {
      return {
        pos: 'top',
        style: 'card',
        activeTabName: '非隧道工程',
        show: false,
        testData: ''
      }
    },
    mounted () {
      this.$http.get('services/org-params').then(item => {
        let month = 26
        if (item) {
          const { monthEnd = 26 } = item['sm-stat-cycle'] || {}
          month = monthEnd || 26
        }
        if (new Date(dayjs().date(month).format('YYYY-MM-DD')).getTime() < new Date(dayjs().format('YYYY-MM-DD')).getTime()) {
          this.$store.commit('setStatMonth', {
            startDate: dayjs().date(month).add(1, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD')
          })
        } else {
          this.$store.commit('setStatMonth', {
            startDate: dayjs().subtract(1, 'month').date(month).add(1, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD')
          })
        }
        this.show = true
      })
    },
    methods: {
      onTabChange (tabName) {
        this.activeTabName = tabName
        this.$store.commit('setActiveTabName', tabName)
      }
    }
  }
</script>
<style lang="postcss" scoped>
  .mu-tabs {
    height: 100%;
  }
  .mu-tabs-header[tab-style=card]~.mu-tab-panel {
    border: 1px solid #ebecf0;
    border-top: none;
    padding: 0;
  }
  .mu-tabs-header_tab-wrapper {
    div {
      margin-right: 5px;
      border-left: 1px solid #d9d9d9 !important;
    }
  }
</style>
