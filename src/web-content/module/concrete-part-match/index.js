
import Vue from 'vue'
import '../../include'
import index from './view/index.vue'
import store from './store'
import router from './router'
import muPage from './view/components/mu-page.vue'

Vue.component('mu-page', muPage)

const app = new Vue({
  store,
  router,
  render: h => h(index)
})
app.$mount('#app')
