
import Vue from 'vue'
import VueRouter from 'vue-router'

import '../../include'
import index from './view/index.vue'
import main from './view/main.vue'
import store from './store'

const router = new VueRouter({
  routes: [
    { name: '/', path: '/', component: main }
  ]
})

const app = new Vue({
  store,
  router,
  render: h => h(index)
})
app.$mount('#app')
