import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    configuration: {},
    initTime: null,
    leftDrawer: null,
    rightDrawer: null,
    participants: [],
    NEURONE_AD_API_URL: 'http://localhost:4003',
    classroomConfigurations: []
  },

  mutations: {
    setInitTime(state, payload){
      let initTime = payload.initTime;
      state.initTime = initTime;
    },

    setMetrics(state, payload){
      let configuration = payload.configuration;
      state.configuration = configuration;
    },

    setLeftDrawer(state, payload){
      state.leftDrawer = payload;
    },    

    setRightDrawer(state, payload){
      state.rightDrawer = payload;
    },    

    setParticipants(state, payload){
      state.participants = payload;
    },
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

    getParticipants(state){
      return state.participants;
    },
  }

})
