<template>
  <v-container>
    <CreateClassroomConfiguration/>
  </v-container>
</template>

<script>
import CreateClassroomConfiguration from '../components/ClassroomConfigurations/CreateClassroomConfiguration';

export default {
  name: 'CreateClassroomConfigurationView',
  
  components: {
    CreateClassroomConfiguration
  }    
}
</script>
