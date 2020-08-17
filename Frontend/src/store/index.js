import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /*NEURONE-AM*/
    configuration: null,
    initTime: null,
    /*NEURONE-AD Backend URL*/
    NEURONE_AD_API_URL: 'http://localhost:4003',
    /*Drawers visibility*/
    leftDrawer: null,
    rightDrawer: null,
    /*Right Drawer*/
    rightDrawerOption: null,
    allParticipants: [],
    selectedParticipants: [],
    rightDrawerParticipantUsername: null,
    /*Line Chart*/
    showLineChart: null,
    lineChartUsername: null,
    lineChartSelectedMetric: null,
    /*Left Drawer*/
    tabs: [
      { id: 1, title: 'Sesión', icon: 'mdi-cogs', route: '/', disabled: false },				
      { id: 2, title: 'Aula', icon: 'mdi-google-classroom', route: '/classroom', disabled: true },
      { id: 3, title: 'Configuraciones de aula', icon: 'mdi-toolbox', route: '/classroom-configurations', disabled: false },
      { id: 4, title: 'Métricas', icon: 'mdi-chart-timeline-variant', route: '/metrics-configuration', disabled: false }
    ],
    /*Put request params*/
    classroomConfigurationId: null,
    metricId: null
  },

  mutations: {
    setConfiguration(state, payload){
      state.configuration = payload;
    },

    setInitTime(state, payload){
      state.initTime = payload;
    },

    setLeftDrawer(state, payload){
      state.leftDrawer = payload;
    },    

    setRightDrawer(state, payload){
      state.rightDrawer = payload;
    },  
    
    setRightDrawerOption(state, payload){
      state.rightDrawerOption = payload;
    },    

    setAllParticipants(state, payload){
      state.allParticipants = payload;
    },

    setSelectedParticipants(state, payload){
      state.selectedParticipants = payload;
    },

    setRightDrawerParticipantUsername(state, payload){
      state.rightDrawerParticipantUsername = payload;
    },

    setShowLineChart(state, payload){
      state.showLineChart = payload;
    },

    setLineChartUsername(state, payload){
      state.lineChartUsername = payload;
    },

    setLineChartSelectedMetric(state, payload){
      state.lineChartSelectedMetric = payload;
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

    getRightDrawerOption(state){
      return state.rightDrawerOption;
    },    

    getAllParticipants(state){
      return state.allParticipants;
    },

    getSelectedParticipants(state){
      return state.selectedParticipants;
    },

    getRightDrawerParticipantUsername(state){
      return state.rightDrawerParticipantUsername;
    },

    getShowLineChart(state){
      return state.showLineChart;
    },

    getLineChartUsername(state){
      return state.lineChartUsername;
    },

    getLineChartSelectedMetric(state){
      return state.lineChartSelectedMetric;
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
