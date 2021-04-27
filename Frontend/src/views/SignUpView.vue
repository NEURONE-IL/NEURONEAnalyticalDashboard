<template>
  <v-row class="fill-height" style="background-image: linear-gradient(rgba(17,106,197,1) 11.2%, rgba(31,179,237,0.5) 91.1%);">
    <SignUp/>
  </v-row>
</template>

<script>
import SignUp from '../components/Auth/SignUp';

export default {
  name: 'SignUpView',
  
  components: {
    SignUp
  }
}
</script>

<style scoped>
.signUpContainer.fill-height { 
  flex-wrap: wrap; 
} 
.signUpContainer.fill-height > .row { 
  flex: 1 1 100%;
}
</style>