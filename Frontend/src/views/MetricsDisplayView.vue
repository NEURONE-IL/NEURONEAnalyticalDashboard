<template>
  <v-container>
    <MetricsDisplay/>
  </v-container>
</template>

<script>
import MetricsDisplay from '../components/Metrics/MetricsDisplay';

export default {
  name: 'MetricsDisplayView',
  
  components: {
    MetricsDisplay
  }    
}
</script>
