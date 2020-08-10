<template>
  <v-container>
    <SessionStats/>
  </v-container>
</template>

<script>
import SessionStats from '../components/General/SessionStats';

export default {
  name: 'SessionStatsView',
  
  components: {
    SessionStats
  }    
}
</script>
