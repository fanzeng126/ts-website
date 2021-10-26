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

<style>
.mc-page-slot-wrapper{
  overflow: unset!important;
}
</style>
