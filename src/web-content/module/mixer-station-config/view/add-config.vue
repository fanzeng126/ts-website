<template>
  <mu-dialog
    :visible="localVisible"
    class="add-config"
    model-control="external"
    keep-alive
    width="400px"
    :height="`${height}px`"
    :draggable="true"
    :title="title"
    primary-button="确认"
    :buttons="['取消', '确认']"
    @change="onLocalVisibleChange"
    @buttonclick="onButtonClick">
    <mu-form
      style="height: 100%;flex-direction: column;">
      <mu-v-box style="width: 100%;">
        <mu-form-field
          label-width="100px"
          label="机组编号："
          required>
          <mu-combo-box
            v-model="singleData.mixerNo"
            placeholder="请选择机组编号"
            :options="mixerNoOptions"
            :clearable="false" />
        </mu-form-field>
        <mu-form-field
          label-width="100px"
          label="系统："
          required>
          <mu-combo-box
            v-model="singleData.mixerSystem"
            placeholder="请选择系统"
            :clearable="false"
            :options="systemOptions"
            @change="changeMixerSystem" />
        </mu-form-field>
        <mu-form-field
          label-width="100px"
          label="是否主动下发：">
          <mu-toggle
            v-model="singleData.isIssue"
            active-label="是"
            inactive-label="否"
            style="width: 75px;" />
        </mu-form-field>
      </mu-v-box>
      <mu-form-field
        v-if="showConfig"
        size="1"
        required
        label-width="100px"
        label="配置：">
        <textarea
          v-model="singleData.config"
          type="text"
          class="mu-input textarea" />
      </mu-form-field>
    </mu-form>
  </mu-dialog>
</template>
<script>
  import { notify } from '@mctech/mussel'
  import { unzip, gzip } from '@utils/gzip'

  export default {
    dialogName: 'dlgManageZone',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      record: {
        type: Object,
        default: () => {
          return {}
        }
      },
      configList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        localVisible: false,
        singleData: {},
        height: 292,
        mixerNoOptions: [
          { label: '1#机组', value: 1 },
          { label: '2#机组', value: 2 },
          { label: '3#机组', value: 3 },
          { label: '4#机组', value: 4 },
          { label: '5#机组', value: 5 },
          { label: '6#机组', value: 6 },
          { label: '7#机组', value: 7 },
          { label: '8#机组', value: 8 }
        ],
        systemOptions: [],
        systemConfig: {},
        showConfig: false
      }
    },
    computed: {
      title () {
        return this.record.id ? '修改配置' : '新增配置'
      }
    },
    watch: {
      record: {
        handler () {
          if ('id' in this.record) {
            this.singleData = Object.assign(
              {},
              this.record,
              { config: unzip(this.record.config) },
              { mixerSystem: null }
            )
          }
        },
        immediate: true
      },
      visible (val) {
        if (val) this.getRedisConfig()
        this.localVisible = val
      },
      localVisible (val) {
        this.$emit('change', val)
      }
    },
    mounted () {
      const match = location.search.match('showConfig=true')
      this.showConfig = !!match
      if (this.showConfig) {
        this.height += 214
      }
      this.localVisible = this.visible
    },
    methods: {
      onLocalVisibleChange: function (v, btn) {
        this.localVisible = v
        if (!v) {
          this.singleData = {}
        }
      },
      onButtonClick: function (btn, win) {
        if (btn === '确认') {
          if (!('mixerNo' in this.singleData)) {
            notify('warning', '请选择机组编号')
            return ''
          }
          if (!('mixerSystem' in this.singleData)) {
            notify('warning', '请选择请选择系统')
            return ''
          }
          if (!('config' in this.singleData) || !this.singleData.config) {
            notify('warning', '请填写配置')
            return ''
          }
          const { mixerNo, mixerSystem, isIssue, config, id } = this.singleData
          // 判断机组编号是否已经存在
          let filters
          if (id) {
            filters =
              this.configList.filter(item => item.mixerNo === mixerNo && item.id !== id)
          } else {
            filters = this.configList.filter(item => item.mixerNo === mixerNo)
          }
          if (filters.length) {
            notify('warning', '该机组已存在，不可重复添加')
            return ''
          }
          const saveData = {}
          saveData.mixerNo = mixerNo
          saveData.mixerSystem = this.systemConfig[mixerSystem]?.label
          saveData.isIssue = !!isIssue
          saveData.config = gzip(config)
          if (id) {
            saveData.id = id
            this.$http.patch('services/mixer-station-config', saveData).then(res => {
              if (res) {
                notify('success', '修改成功')
              }
              win.hide()
            })
          } else {
            this.$http.post('services/mixer-station-config', saveData).then(res => {
              if (res) {
                notify('success', '保存成功')
              }
              win.hide()
            })
          }
        } else {
          win.hide()
        }
      },
      getRedisConfig () {
        this.$http.get('services/default-mixer-station-config').then(res => {
          let configArr = []
          let mixerSystem
          if (res && Object.keys(res).length) {
            configArr = Array.from(Object.entries(res)).map(([k, v], index) => {
              if (this.record.mixerSystem === k) {
                mixerSystem = index
              }
              const config = unzip(v)
              this.systemConfig[index] = { config, label: k }
              return {
                value: index,
                label: k
              }
            })
          }
          if (this.record.mixerSystem) {
            this.singleData = Object.assign(
              {},
              this.record,
              { config: unzip(this.record.config) },
              { mixerSystem }
            )
          }
          this.systemOptions.splice(0, this.systemOptions.length, ...configArr)
        })
      },
      changeMixerSystem (val) {
        this.singleData.config = this.systemConfig[val]?.config
      }
    }
  }
</script>
<style lang="postcss" scoped>
.mu-input.textarea {
  line-height: 16px;
  font-size: 12px;
  height: 200px;
  font-weight: 400;
  color: #333;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
        "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>
