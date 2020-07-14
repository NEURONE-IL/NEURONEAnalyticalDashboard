<template>
  <v-container>
    <ManageClassroomConfigurations/>
  </v-container>
</template>

<script>
import ManageClassroomConfigurations from '../components/ClassroomConfigurations/ManageClassroomConfigurations';

export default {
  name: 'ManageClassroomConfigurationsView',
  
  components: {
    ManageClassroomConfigurations
  }    
}
</script>
