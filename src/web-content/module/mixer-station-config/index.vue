<template>
  <mc-page>
    <config-list />
  </mc-page>
</template>
<script>
  import configList from './view/config-list.vue'
  export default {
    components: {
      'config-list': configList
    },
    data () {
      return {
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

<style lang="postcss">
.mc-page-slot-wrapper{
  overflow: unset!important;
}
.add-config {
  .mu-dialog-footer {
    border-top: 1px solid #ebecf0;
  }
}
.exported {
  .mu-icon.ipm-iconimport {
    transform: rotate(-180deg);
  }
}
</style>
