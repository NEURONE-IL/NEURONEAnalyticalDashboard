<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="(participant,i) in this.participants"
      :key="i"
    >
      <v-expansion-panel-header>{{ participant.username }}</v-expansion-panel-header>
      <v-expansion-panel-content> 
        <div>{{this.results[principal]}}: {{this.results[principal]}}</div>
        <div v-for="(value,metric,index) in participant.results" :key="index">
          <div v-if="metric!==principal">
            <div>{{metric}}: {{value}}</div>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>

export default {
	name: 'Lateral',

  props: {
    participants: []
  },

	data (){
		return {
      
    }
  }
}