<template>
  <mu-v-box
    style="height:100%"
    content-spacing>
    <mu-h-box class="header">
      <span class="title">
        搅拌站机组配置
      </span>
      <mu-h-box>
        <mu-button
          class="exported"
          icon-class="ipm-iconImport"
          caption="下载授权文件"
          @click="exported" />
      </mu-h-box>
    </mu-h-box>
    <mu-v-box
      size="1"
      bordered
      class="content">
      <mu-h-box content-spacing>
        <mu-button
          icon-class="ipm-iconplus-circle"
          caption="新增配置"
          button-type="primary"
          @click="addConfig" />
      </mu-h-box>
      <mu-v-box
        size="1"
        content-spacing>
        <div
          v-show="configList.length"
          id="config-list"
          style="height:100%;" />
        <div
          v-show="!configList.length"
          class="prompt-container"
          style="height:100%;">
          <div
            class="mu-absolute-fit mu-prompt-panel mu-flex-box"
            align-items="center"
            content-spacing
            direction="row">
            <mu-icon :svg="folder" />
            <div content-spacing="between">
              <div class="mu-prompt-panel_headline">
                抱歉～
              </div>
              <div
                class="mu-prompt-panel_message"
                style="color:#333">
                当前暂无配置数据
              </div>
              <mu-h-box class="mu-prompt-panel_foot">
                建议您 : 新增配置后查看
              </mu-h-box>
            </div>
          </div>
        </div>
      </mu-v-box>
    </mu-v-box>
    <add-config
      :visible="visible"
      :record="record"
      :config-list="configList"
      @change="change" />
  </mu-v-box>
</template>
<script>
  import configList from './config-list'
  import addConfig from './add-config.vue'
  import folder from './folder.svg'

  export default {
    inject: ['application'],
    components: {
      'add-config': addConfig
    },
    mixins: [configList],
    data () {
      return {
        configList: [],
        visible: false,
        record: {}
      }
    },
    computed: {
      folder () {
        return folder
      }
    },
    mounted () {
      this.queryData()
    },
    methods: {
      async queryData () {
        const data = await this.$http.get('services/mixer-station-config')
        const temp = data.map((item, index) => {
          return {
            orderNo: index + 1,
            ...item,
            mixerNoLabel: `${item.mixerNo}#机组`
          }
        })
        this.configList.splice(0, this.configList.length, ...temp)
      },
      addConfig () {
        this.visible = true
      },
      exported () {
        const { orgId, orgShortName } = this.application.context
        window.open(`services/mixer-station-config/download-license?orgId=${encodeURI(orgId)}&orgName=${encodeURI(orgShortName)}`)
      },
      change (val) {
        this.visible = val
        if (!val) {
          this.record = {}
          this.queryData()
        }
      }
    }
  }
</script>
<style lang="postcss" scoped>
.header {
  justify-content: space-between;
  .title {
    font-size: 16px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    font-weight: 700;
    display: flex;
    align-items: center;
  }
}

.content {
  & > div:first-child {
    border-bottom: 1px solid #d9d9d9;
    padding: 8px 16px;
  }
}
.mu-prompt-panel_headline,.mu-prompt-panel_message {
  font-weight: 700;
}
.mu-prompt-panel_foot {
  font-size: 14px;
  color: #434e59;
  line-height: 19px;
}
</style>
