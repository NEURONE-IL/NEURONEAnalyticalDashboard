<template>
  <v-container>
    <Classroom/>
    <RightDrawer/>
  </v-container>
</template>

<script>
import Classroom from '../components/Classroom/Classroom';
import RightDrawer from '../components/Classroom/RightDrawer';

export default {
  name: 'ClassroomView',
  
  components: {
    Classroom,
    RightDrawer
  }    
}
</script>