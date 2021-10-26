<template>
  <mc-page>
    <keep-alive>
      <router-view />
    </keep-alive>
  </mc-page>
</template>
<script>
  export default {
    data () {
      return {
        transitionName: 'slide-left'
      }
    }
  }
</script>

<style lang="postcss">
.mc-page-slot-wrapper{
  overflow: unset!important;
}
.stat-period {
  .mu-bordered {
    border: none!important;
  }
  .mu-list-item {
    padding-left: 45px;
    border-top: 1px solid #ebecf0;
  }
  .mu-expander_body {
    & > div {
      & > .mu-list-item:last-child {
        border-bottom: 1px solid #ebecf0;
      }
    }
  }
  .mu-list-item.active {
    background: #F4FBFF;
  }
}
</style>
