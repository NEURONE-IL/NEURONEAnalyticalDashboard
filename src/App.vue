<template>
  <v-app id="app">
    <LeftDrawer/>
    <v-content>
      <router-view/>
    </v-content>    
  </v-app>
</template>

<script>
import LeftDrawer from './components/LeftDrawer.vue';

export default {
  name: 'App',

  components: {
    LeftDrawer
  },

  data: () => ({
    //
  })
};
</script>
