<template>
  <mu-dialog
    :visible="visible"
    model-control="external"
    keep-alive
    width="480px"
    height="240px"
    :draggable="true"
    title="退出编辑提示"
    :buttons="buttons"
    @change="changeState"
    @buttonclick="onButtonClick">
    <mu-v-box
      text-align="center"
      justify-content="center"
      style="height:100%;">
      检索到有未保存内容，是否确认退出编辑?
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
      saveState: {
        type: Boolean,
        default: () => false
      }
    },
    computed: {
      buttons () {
        return [
          { caption: '取消' },
          { caption: '不保存并退出' },
          { caption: '保存并退出', buttonType: 'primary', disabled: this.saveState }
        ]
      }
    },
    methods: {
      onButtonClick ({ caption }) {
        if (caption === '取消') {
          this.$emit('cancelEdit')
          return
        }
        if (caption === '不保存并退出') {
          this.$emit('exit')
          return
        }
        this.$emit('save', true)
      },
      changeState (val) {
        if (!val) {
          this.$emit('cancelEdit')
        }
      }
    }
  }
</script>