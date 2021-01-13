import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import store from '../store'
/*Views*/
import ClassroomConfigurationsView from '../views/ClassroomConfigurationsView.vue'
import ClassroomView from '../views/ClassroomView.vue'
import LoginView from '../views/LoginView.vue'
import MetricsDisplayView from '../views/MetricsDisplayView.vue'
import SessionStatsView from '../views/SessionStatsView.vue'
import SettingsView from '../views/SettingsView.vue'

Vue.use(VueRouter)

/*
 
 */
async function isInit(to, from, next){
  await axios
  .get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/ifsession`)
  .then(response => {
    if(response.data.status){
			let settings = {
        limit: response.data.limit,
        metrics: response.data.metrics,
        option: response.data.option,
        principal: response.data.principal
			};      
      store.commit('setSettings', settings)
      localStorage.setItem('settings', JSON.stringify(settings));
      next('/classroom');
    }
    else{
      store.commit('destroySettings');
      next();
    }
  })
  .catch(error => {
    next()
  })
}

async function notInit(to, from, next){
  console.log('notinit')
  console.log(from)
  console.log(to)
  if(from.path !== '/settings'){
    await axios
    .get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/ifsession`)
    .then(response => {
      console.log(response.data)
      if(response.data.status){
        next();
      }else{
        next('/settings')
      }
    })
    .catch(error => {
      next('/settings')
    })
  }else{
    next();
  }
}


const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    beforeEnter: isInit,
    meta: { requiresAuth: true }
  },  
  {
    path: '/classroom',
    name: 'Classroom',
    component: ClassroomView,
    beforeEnter: notInit,
    meta: { requiresAuth: true }
  },
  {
    path: '/classroom-configurations',
    name: 'ClassroomConfigurations',
    component: ClassroomConfigurationsView,
    meta: { requiresAuth: true }   
  },
  {
    path: '/metrics',
    name: 'MetricsDisplay',
    component: MetricsDisplayView,
    meta: { requiresAuth: true }
  },
  {
    path: '/session-stats',
    name: 'SessionStats',
    component: SessionStatsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresVisitor: true } 
  },
  {
    path: '*',
    redirect: '/settings'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
