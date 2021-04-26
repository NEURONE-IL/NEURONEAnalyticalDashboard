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
import { mapActions } from 'vuex';

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
  },

  methods: {
		/*
		@fvillarrealcespedes:
		Methods imported from store.
		*/
    ...mapActions([
      'getMetrics'
    ])
  },

  computed: {
		/*
		@fvillarrealcespedes:
		Authenticated user, get and set methods are imported from store.
		*/	    
		user: {
      get () {
        return this.$store.getters.getUser;
      }
    }
  }
};
</script>

<style>
.amcharts-amexport-item {
  border: 1px solid #000;
}
</style>