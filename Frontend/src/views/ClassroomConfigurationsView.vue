<template>
  <v-container>
    <ClassroomConfigurations/>
  </v-container>
</template>

<script>
import ClassroomConfigurations from '../components/ClassroomConfigurations/ClassroomConfigurations';
import { mapActions } from 'vuex';

export default {
  name: 'ClassroomConfigurationsView',
  
  components: {
    ClassroomConfigurations
  },

  created(){
    this.getClassroomConfigurations();
    this.$store.dispatch('refreshSession');
  },

  methods: {
		/*
		@fvillarrealcespedes:
		Methods imported from store.
		*/
    ...mapActions([
      'getClassroomConfigurations'
    ]),
  }
}
</script>
