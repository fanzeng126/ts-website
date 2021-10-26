<template>
  <mu-h-box class="box mu-absolute-fit">
    <div class="img-box">
      <mu-icon class="file" icon-class="ipm-iconfolder-open-fill" />
      <mu-icon class="question" icon-class="ipm-iconquestion" />
    </div>
    <div>
      <p class="title"><b>{{ title }}</b></p>
      <p class="tip"><b>{{ tipText }}</b></p>
      <slot />
    </div>
  </mu-h-box>
</template>
<script>
  export default {
    props: {
      tipText: {
        type: String,
        default: '当前暂无数据'
      },

      title: {
        type: String,
        default: '抱歉~'
      }
    }
  }
</script>

<style scoped>
  p {
    margin: 0;
  }

  .box {
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }

  .title {
    font-size: 24px;
  }

  .tip {
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 19px;
  }

  .img-box {
    width: 140px;
    height: 155px;
    position: relative;
    margin-right: 30px;
  }

  .file {
    font-size: 140px;
    color: #dde1e7;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .question {
    font-size: 50px;
    color: #dde1e7;
    position: absolute;
    top: 0;
    left: 48px;
    font-weight: 900;
    transform: rotate(15deg);
  }
</style>
