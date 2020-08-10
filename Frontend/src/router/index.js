import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import axios from 'axios'
/*Views*/
import ClassroomView from '../views/ClassroomView.vue'
import ConfigurationView from '../views/ConfigurationView.vue'
import CreateClassroomConfigurationView from '../views/CreateClassroomConfigurationView.vue'
import UpdateClassroomConfigurationView from '../views/UpdateClassroomConfigurationView.vue'
import ClassroomConfigurationsView from '../views/ClassroomConfigurationsView.vue'
import MetricsConfigurationView from '../views/MetricsConfigurationView.vue'
import SessionStatsView from '../views/SessionStatsView.vue'

Vue.use(VueRouter)

async function isInit(to, from, next){
  await axios
  .get(`${process.env.VUE_APP_API_URL}/ifsession`)
  .then(response => {
    if(response.data.status){
      console.log('router response', response);
      store.commit('setConfiguration', {
        configuration: {
          limit: response.data.limit,
          metrics: response.data.metrics,
          option: response.data.option,
          principal: response.data.principal
        }
      })
      next('/classroom')
    }
    else{
      next('/configuration')
    }
  })
  .catch(error => {
    next('/configuration')
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
    path: '/configuration',
    name: 'Configuration',
    component: ConfigurationView,
  },  
  {
    path: '/classroom',
    name: 'Classroom',
    component: ClassroomView
  },
  {
    path: '/create-classroom-configuration',
    name: 'CreateClassroomConfiguration',
    component: CreateClassroomConfigurationView
  },
  {
    path: '/update-classroom-configuration',
    name: 'UpdateClassroomConfiguration',
    component: UpdateClassroomConfigurationView
  },
  {
    path: '/classroom-configurations',
    name: 'ClassroomConfigurations',
    component: ClassroomConfigurationsView    
  },
  {
    path: '/metrics-configuration',
    name: 'MetricsConfiguration',
    component: MetricsConfigurationView    
  },
  {
    path: '/session-stats',
    name: 'SessionStats',
    component: SessionStatsView    
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
