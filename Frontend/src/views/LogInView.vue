<template>
  <v-row class="fill-height" style="background-image: linear-gradient(rgba(17,106,197,1) 11.2%, rgba(31,179,237,0.5) 91.1%);">
    <LogIn v-show="logInService === 0"/>
    <LogInNEURONEAuth v-show="logInService === 1"/>
  </v-row>
</template>

<script>
import LogIn from '../components/Auth/LogIn';
import LogInNEURONEAuth from '../components/Auth/LogInNEURONEAuth';

export default {
  name: 'LogInView',
  
  components: {
    LogIn,
    LogInNEURONEAuth
  },

	computed: {
    /*
		@fvillarrealcespedes:
		LogInService property to check if user uses or not NEURONE-Auth, get and set methods are imported from store.
		*/	    
    logInService: {
      get () {
        return this.$store.getters.getLogInService;
      },
      set (payload) {
        this.$store.commit('setLogInService', payload);
      }
		}
	}	
}
</script>

<style scoped>
.logInContainer.fill-height { 
  flex-wrap: wrap; 
} 
.logInContainer.fill-height > .row { 
  flex: 1 1 100%;
}
</style>