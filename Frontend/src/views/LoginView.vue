<template>
  <v-container>
    <Login/>
  </v-container>
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