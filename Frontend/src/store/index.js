import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /*NEURONE AM*/
    configuration: {},
    initTime: null,
    /*Drawer visibility*/
    leftDrawer: null,
    rightDrawer: null,
    /*Right Drawer */
    allParticipants: [],
    selectedParticipants: [],
    /*NEURONE AD Backend URL*/
    NEURONE_AD_API_URL: 'http://localhost:4003',
    /*Line Chart*/
    showLineChart: null,
    username: null,
    selectedMetric: null,
    /*Left Drawer*/
    tabs: [
      { id: 1, title: 'Sesión', icon: 'mdi-cogs', route: '/', disabled: false },				
      { id: 2, title: 'Aula', icon: 'mdi-google-classroom', route: '/classroom', disabled: true },
      { id: 3, title: 'Configuraciones de aula', icon: 'mdi-toolbox', route: '/classroom-configurations', disabled: false },
      { id: 4, title: 'Métricas', icon: 'mdi-chart-timeline-variant', route: '/metrics-configuration', disabled: false },
    ],
    /*Put request params*/
    classroomConfigurationId: null,
    metricId: null
  },

  mutations: {
    setConfiguration(state, payload){
      state.configuration = payload.configuration;
    },

    setInitTime(state, payload){
      state.initTime = payload.initTime;
    },

    setLeftDrawer(state, payload){
      state.leftDrawer = payload;
    },    

    setRightDrawer(state, payload){
      state.rightDrawer = payload;
    },    

    setAllParticipants(state, payload){
      state.allParticipants = payload;
    },

    setSelectedParticipants(state, payload){
      state.selectedParticipants = payload;
    },

    setShowLineChart(state, payload){
      state.showLineChart = payload;
    },

    setUsername(state, payload){
      state.username = payload;
    },

    setSelectedMetric(state, payload){
      state.selectedMetric = payload;
    },

    setTabs(state, payload){
      state.tabs = payload;
    },

    setClassroomConfigurationId(state, payload){
      state.classroomConfigurationId = payload;
    },

    setMetricId(state, payload){
      state.metricId = payload;
    }    
  },

  getters:{
    getConfiguration(state){
      return state.configuration;
    },

    getInitTime(state){
      return state.initTime;
    },

    getLeftDrawer(state){
      return state.leftDrawer;
    },

    getRightDrawer(state){
      return state.rightDrawer;
    },

    getAllParticipants(state){
      return state.allParticipants;
    },

    getSelectedParticipants(state){
      return state.selectedParticipants;
    },

    getShowLineChart(state){
      return state.showLineChart;
    },

    getUsername(state){
      return state.username;
    },

    getSelectedMetric(state){
      return state.selectedMetric;
    },

    getTabs(state){
      return state.tabs;
    },

    getClassroomConfigurationId(state){
      return state.classroomConfigurationId;
    },

    getMetricId(state){
      return state.metricId;
    }      
  }
})
