<template>
  <v-app id="app">
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>
    <v-content>
      <Classrooms/>
    </v-content>
  </v-app>
</template>

<script>
import Classrooms from './components/Classrooms';

export default {
  name: 'App',

  components: {
    Classrooms,
  },

  data: () => ({
    //
  }),
};
</script>
