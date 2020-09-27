<template>
  <v-app id="app">
    <LeftDrawer 
      v-if="user"
    />
    <v-main>
      <Notification/>
      <router-view/>
    </v-main>    
  </v-app>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import LeftDrawer from './components/General/LeftDrawer.vue';
import Notification from './components/General/Notification.vue';
import axios from 'axios';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',

  components: {
		LeftDrawer,
		Notification
  },

  data(){
    return{
			//
		}
  },

  created(){
    this.getMetrics();
    this.getClassroomConfigurations();
    this.$store.dispatch('refreshSession');
  },

  methods: {
		/*
		@fvillarrealcespedes:
		Methods imported from store.
		*/
    ...mapActions([
      'getMetrics',
      'getClassroomConfigurations'
    ])
  },

  computed: {
    
		user: {
      get () {
        return this.$store.getters.getUser;
      }
    }
  }
};
</script>
