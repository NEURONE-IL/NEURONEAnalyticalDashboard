import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    configuration: {},
    initTime: null,
    drawer: null
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

    setDrawer(state, payload) {
      state.drawer = payload;
    },    
  },

  getters:{
    getConfiguration(state){
      return state.configuration;
    },

    getInitTime(state){
      return state.initTime;
    }

  }

})
