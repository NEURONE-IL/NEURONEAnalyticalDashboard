<template>
  <v-container>
    <Classroom/>
    <RightDrawer/>
  </v-container>
</template>

<script>

import Classroom from '../components/Classroom'
import RightDrawer from '../components/RightDrawer.vue';

export default {
  name: 'ClassroomView',
  
  components: {
    Classroom,
    RightDrawer
  }    
}
</script>
