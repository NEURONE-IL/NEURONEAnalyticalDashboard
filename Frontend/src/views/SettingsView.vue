<template>
  <v-container>
   <v-col cols="12" class="text-center">
				<h2> {{ $t('settings.header') }} </h2>
				<v-divider></v-divider>	
    </v-col>    
      <v-tabs
        left
      >
        <v-tab
          @click="setValue(0)">
            <v-icon left>mdi-plus-circle</v-icon>
            {{ $t('settings.tabs.new') }}
        </v-tab>
  
        <v-tab
          @click="setValue(1)">
          <v-icon left>mdi-content-save-all</v-icon>
            {{ $t('settings.tabs.saved') }}
        </v-tab>
      </v-tabs> 
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
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
.title{
	text-align: left;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>