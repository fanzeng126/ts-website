<template>
  <div
    class="mu-expander"
    :expanded="actualExpanded"
    @click="onClick">
    <slot name="header">
      <div class="mu-expander_header" expand-trigger>
        <mu-icon
          :class="actualExpanded ? 'ipm-iconminus-square':'ipm-iconplus-square'"
          style="margin-right: 8px;"
          :expanded="actualExpanded" />
        {{ title }}
      </div>
    </slot>
    <div
      v-show="!disabled"
      class="mu-expander_body"
      :style="{ height: wrapperHeight }">
      <div ref="wrapper" @click.stop>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  import { Expander } from '@mctech/mussel'
  export default {
    extends: Expander
  }
</script>
<style lang="postcss" scoped>
.mu-expander_header {
  padding-left: 10px;
  justify-content: start;
}
</style>
