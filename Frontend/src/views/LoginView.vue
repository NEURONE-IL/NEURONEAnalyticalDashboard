<template>
  <v-row class="fill-height" style="background-image: linear-gradient(rgba(17,106,197,1) 11.2%, rgba(31,179,237,0.5) 91.1%);">
    <Login/>
  </v-row>
</template>

<script>
import Login from '../components/Auth/Login';

export default {
  name: 'LoginView',
  
  components: {
    Login
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