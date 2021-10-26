import Vue from 'vue'
import VueRouter from 'vue-router'
import main from './view/main.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      meta: {
        istrun: true
      },
      component: main
    }
  ]
})

export default router
