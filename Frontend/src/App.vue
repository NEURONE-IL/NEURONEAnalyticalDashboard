<template>
  <v-app id="app">
    <LeftDrawer/>
    <v-main>
      <router-view/>
    </v-main>    
  </v-app>
</template>

<script>
import LeftDrawer from './components/General/LeftDrawer.vue';

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
