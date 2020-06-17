<template>
  <v-app id="app">
    <Layout/>
    <v-content>
      <router-view/>
    </v-content>    
  </v-app>
</template>

<script>
import Layout from './components/Layout.vue';

export default {
  name: 'App',

  components: {
    Layout
  },

  data: () => ({
    //
  }),

  computed: {
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set (payload) {
        this.$store.commit('setDrawer', payload);
      },
    },
  },  
};
</script>
