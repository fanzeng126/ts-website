<template>
  <mc-page>
    <router-view :key="key" />
  </mc-page>
</template>

<script>
  export default {
    computed: {
      key () {
        return this.$route.path + Math.random()
      }
    }
  }
</script>
