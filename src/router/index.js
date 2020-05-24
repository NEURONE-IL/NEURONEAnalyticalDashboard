import Vue from 'vue'
import VueRouter from 'vue-router'
import ClassroomView from '../views/ClassroomView.vue'
import ConfigurationView from '../views/ConfigurationView.vue'
import TestView from '../views/TestView.vue'
import OldView from '../views/OldView.vue'
import store from '../store'
import axios from 'axios'

Vue.use(VueRouter)

async function isInit(to, from, next){
  await axios
  .get(`${process.env.VUE_APP_API_URL}/ifsession`)
  .then(response => {
    if(response.data.status){
      store.commit("setMetrics", {
        configuration: {
          limit: response.data.limit,
          metrics: response.data.metrics,
          option: response.data.option,
          principal: response.data.principal
        }
      })
      next('/old')
      //next('/classroom')
    }
    else{
      next('/')
    }
  })
  .catch(error => {
    next('/')
  })
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConfigurationView,
    beforeEnter: isInit
  },
  {
    path: '/classroom',
    name: 'Classroom',
    component: ClassroomView
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView
  },{
    path: '/old',
    name: 'Old',
    component: OldView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
