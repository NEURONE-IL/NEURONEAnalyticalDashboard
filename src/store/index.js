import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    configuration: {},
    initTime: null,
    leftDrawer: null,
    rightDrawer: null,
    participants: []
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

    getParticipants(state){
      return state.participants;
    }

  }

})
