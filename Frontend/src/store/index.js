import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /*NEURONE-AM*/
    settings: JSON.parse(localStorage.getItem('settings')) || null,
    initTime: null,
    /*User*/
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    /*Login Service*/
    loginService: 0,
    /*Classroom chart*/
    classroomChartOn: null,
    /*AllMetrics*/
    metrics: [],    
    /*Classroom Configurations*/
    classroomConfigurations: [],  
    /*Session Settings*/
    sessionSettings: [],
    /*Drawers visibility*/
    leftDrawer: null,
    rightDrawer: null,
    /*Right Drawer*/
    rightDrawerOption: null,
    allParticipants: [],
    selectedParticipants: [],
    rightDrawerParticipantUsername: null,
    /*Bar Chart*/
    showBarChart: null,
    /*Line Chart*/
    showLineChart: null,
    lineChartUsername: null,
    lineChartSelectedMetric: null,
    /*Left Drawer*/
    tabs: [
      { id: 1, title: 'store.tabs.session', icon: 'mdi-cogs', route: '/settings', disabled: false },				
      { id: 2, title: 'store.tabs.classroom', icon: 'mdi-google-classroom', route: '/classroom', disabled: true },
      { id: 3, title: 'store.tabs.classroomConfigurations', icon: 'mdi-toolbox', route: '/classroom-configurations', disabled: false },
      { id: 4, title: 'store.tabs.metrics', icon: 'mdi-chart-timeline-variant', route: '/metrics', disabled: false }
    ],
    /*Put request params*/
    classroomConfigurationId: null,
    /*Notifications*/
    snackbar: {
      show: null,
      icon: null,
      text: null,
      timeout: null,
      color: null
    },
    /*Session Participants*/
    sessionParticipants: null
  },

  actions: {
		/*
		@fvillarrealcespedes:
		Sends a request to get all metrics, then sets metric property as the response data. 
		*/    
    async getMetrics(context){
      await axios
      .get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}` + '/metrics')
      .then(response => {
        context.commit('setMetrics', response.data);
      })
      .catch(error => {
        console.log(error.response);
      })
    },

		/*
		@fvillarrealcespedes:
		Sends a request to get all classrooms configurations, then sets classroomConfigurations property as the response data. 
		*/    
    async getClassroomConfigurations(context){
      await axios
      .get(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/classroom-configurations', { headers: { 'x-access-token': context.getters.getUser.accessToken }})
      .then(response => {
        context.commit('setClassroomConfigurations', response.data.classroomConfigurations);
      })
      .catch(error => {
        console.log(error.response);
      })
    },

		/*
		@fvillarrealcespedes:
		Sends a request to get all session settings, then sets sessionSettings property as the response data. 
		*/    
    async getSessionSettings(context){
      await axios
      .get(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/session-settings', { headers: { 'x-access-token': context.getters.getUser.accessToken }})
      .then(response => {
        context.commit('setSessionSettings', response.data.sessionSettings);
      })
      .catch(error => {
        console.log(error.response);
      })
    },    

    async retrieveUser(context, authObject){
      return new Promise((resolve) => {
        axios
        .post(authObject.urlService, authObject.credentials)
        .then(response => {
          const user = response.data;
          localStorage.setItem('currentUser', JSON.stringify(user));
          context.commit('setUser', user);
          context.dispatch('showNotification', {
            show: true, 
            icon: 'mdi-check-circle', 
            text: 'notifications.login.success', 
            timeout: 5000, 
            color: 'success'
          });
          resolve(response);
        })
        .catch(error => {
          context.dispatch('showNotification', {
            show: true, 
            icon: 'mdi-check-close', 
            text: 'notifications.login.errors.' + error.response.data.code, 
            timeout: 5000, 
            color: 'error'
          });
        })
      })
    },

/*    async createUser(context, user){
      return new Promise((resolve, reject) => {
        axios
        .post(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}/`, credentials)

      })
    },
*/
    
    refreshSession(state){
      state.user = JSON.parse(localStorage.getItem('currentUser'));
    },

    showNotification(context, payload){
      context.commit('setSnackbar', payload);
    }
  },

  mutations: {
    setSettings(state, payload){
      state.settings = payload;
    },

    destroySettings(state){
      localStorage.removeItem('settings');
      state.settings = null;
    },    

    setInitTime(state, payload){
      state.initTime = payload;
    },

    setUser(state, payload){
      state.user = payload;
    },

    destroyUser(state){
      localStorage.removeItem('currentUser');
      state.user = null;
    },

    setLoginService(state, payload){
      state.loginService = payload;
    },

    setClassroomChartOn(state, payload){
      state.classroomChartOn = payload;
    },

    setMetrics(state, payload){
      state.metrics = payload;
    },    

    setClassroomConfigurations(state, payload){
      state.classroomConfigurations = payload
    },

    setSessionSettings(state, payload){
      state.sessionSettings = payload
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

    setShowBarChart(state, payload){
      state.showBarChart = payload;
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

    setSnackbar(state, payload){
      state.snackbar.show = payload.show;
      state.snackbar.icon = payload.icon;
      state.snackbar.text = payload.text;
      state.snackbar.timeout = payload.timeout;
      state.snackbar.color = payload.color;
    },

    setSessionParticipants(state, payload){
      state.sessionParticipants = payload;
    }
  },

  getters:{
    getSettings(state){
      return state.settings;
    },

    getInitTime(state){
      return state.initTime;
    },

    getUser(state){
      return state.user;
    },

    getLoginService(state){
      return state.loginService;
    },    

    getClassroomChartOn(state){
      return state.classroomChartOn;
    },

    getMetrics(state){
      return state.metrics;
    },    

    getClassroomConfigurations(state){
      return state.classroomConfigurations;
    },

    getSessionSettings(state){
      return state.sessionSettings;
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

    getShowBarChart(state){
      return state.showBarChart;
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

    getSnackbar(state){
      return state.snackbar;
    },

    getSessionParticipants(state){
      return state.sessionParticipants;
    }
  }
})