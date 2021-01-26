<template>
  <v-container>
    <SessionStats/>
  </v-container>
</template>

<script>
import SessionStats from '../components/SessionStats/SessionStats';

export default {
  name: 'SessionStatsView',
  
  components: {
    SessionStats
  }    
}
</script>