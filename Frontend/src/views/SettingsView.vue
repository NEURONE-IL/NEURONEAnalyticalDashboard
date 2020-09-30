<template>
  <v-container>
    <v-bottom-navigation
      class="nav"
      :value="value"
      color="primary"
      horizontal
      width="40%"
    >
      <v-btn 
        class="navButton" 
        @click="setValue(0)"
        >
        <span class="navSpan">
          NUEVO AJUSTE
        </span>
        <v-icon right>mdi-new-box</v-icon>
      </v-btn>
      <v-btn 
        class="navButton" 
        @click="setValue(1)"
        >
        <span class="navSpan">
          AJUSTES GUARDADOS
        </span>
        <v-icon right>mdi-database</v-icon>
      </v-btn>
    </v-bottom-navigation>  
    <Settings v-show="value === 0"/>
    <FastSettings v-show="value === 1"/>
  </v-container>
</template>

<script>
import FastSettings from '../components/SessionSettings/FastSettings';
import Settings from '../components/SessionSettings/Settings';

export default {
  name: 'SettingsView',
  
  components: {
    FastSettings,
    Settings
  },

  data(){
    return{
      value: 0
    }
  },

  methods: {
    setValue(value){
      this.value = value;
    }
  }
}
</script>

<style>
.nav{
  box-sizing: content-box;
  block-size: 200px;
  margin: auto;
}
.navButton{
  letter-spacing: normal;
  width: 50%;
}
.navSpan{
  font-weight: 500;
  font-size: 14px;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
