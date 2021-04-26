<template>
  <v-row class="fill-height" style="background-image: linear-gradient(rgba(17,106,197,1) 11.2%, rgba(31,179,237,0.5) 91.1%);">
    <Login v-show="loginService === 0"/>
    <LoginNEURONEAuth v-show="loginService === 1"/>
  </v-row>
</template>

<script>
import Login from '../components/Auth/Login';
import LoginNEURONEAuth from '../components/Auth/LoginNEURONEAuth';

export default {
  name: 'LoginView',
  
  components: {
    Login,
    LoginNEURONEAuth
  },

	computed: {
    /*
		@fvillarrealcespedes:
		LoginService property to check if user uses or not NEURONE-Auth, get and set methods are imported from store.
		*/	    
    loginService: {
      get () {
        return this.$store.getters.getLoginService;
      },
      set (payload) {
        this.$store.commit('setLoginService', payload);
      }
		}
	}	
}
</script>

<style scoped>
.loginContainer.fill-height { 
  flex-wrap: wrap; 
} 
.loginContainer.fill-height > .row { 
  flex: 1 1 100%;
}
</style>