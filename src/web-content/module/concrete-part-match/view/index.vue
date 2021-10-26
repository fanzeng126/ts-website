<template>
  <mc-page>
    <keep-alive>
      <router-view />
    </keep-alive>
  </mc-page>
</template>
<script>
  export default {
    components: {
    },
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
.mc-page-slot-wrapper{
  overflow: unset!important;
}
</style>
