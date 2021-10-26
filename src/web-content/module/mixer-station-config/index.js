
import Vue from 'vue'
import '../../include'
import index from './index.vue'

const app = new Vue({
  render: h => h(index)
})
app.$mount('#app')
