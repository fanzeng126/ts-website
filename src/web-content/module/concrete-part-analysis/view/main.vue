<template>
  <mu-v-box class="pad-16" style="height:100%;">
    <mu-bar class="f-16 margin-b-16"><b>部位实时节超分析</b></mu-bar>
    <mu-tabs-header
      :active-tab="activeTabName"
      :tab-items="tabItems"
      model-control="external"
      tab-style="card"
      class="tabs-header"
      @change="tabChange" />

    <tunnel v-show="activeTabName==='tunnel'" />
    <road-bridge v-show="activeTabName==='roadBridge'" />
  </mu-v-box>
</template>

<script>
  import { mapState } from 'vuex'
  import Tunnel from './tunnel.vue'
  import RoadBridge from './road-bridge.vue'

  export default {
    components: {
      Tunnel,
      RoadBridge
    },

    data () {
      return {
        tabItems: [
          {
            name: 'roadBridge',
            label: '路桥部位节超分析'
          },
          {
            name: 'tunnel',
            label: '隧道里程节超分析'
          }
        ]
      }
    },

    computed: {
      ...mapState({
        activeTabName: 'activeTabName'
      })
    },

    methods: {
      tabChange (val) {
        if (this.activeTabName === val) return
        this.$store.commit('setActiveTab', val)
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

  .tabs-header >>> .mu-tab-item {
    margin-right: 2px !important;
    border-left: 1px solid #d9d9d9 !important;
  }

  .tabs-header >>> .mu-tab-item::after {
    background-color: initial !important;
  }
</style>

<style>
  .mu-tabs-header[tab-position=bottom] .mu-tab-item::after,
  .mu-tabs-header[tab-position=top] .mu-tab-item::after {
    height: 0px !important;
  }

  .mu-tab-item[active] {
    font-weight: bold;
  }

  .mu-tabs-header[tab-position=top]~.mu-tab-panel {
    padding-top: 0px !important;
  }

  .mu-tabs-header[tab-style=card]~.mu-tab-panel {
    padding: 0px !important;
  }

  .mu-tabs-header[tab-position=top] .mu-tab-item {
    margin-right: 2px;
    border-radius: 2px 2px 0px 0px;
  }

  .mu-tabs-header[tab-position=top] .mu-tab-item+.mu-tab-item {
    border-left: 1px solid #d9d9d9 !important;
  }
</style>
