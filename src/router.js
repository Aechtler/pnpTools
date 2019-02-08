import Vue from 'vue'
import Router from 'vue-router'
import Fight from './views/Fight.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/fight',
      name: 'fight',
      component: Fight
    },
    {
      path: '/',
      name: 'about',
      component: About
    }
  ]
})
