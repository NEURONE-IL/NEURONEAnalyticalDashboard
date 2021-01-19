<template>
  <v-container>
		<!-- Button to go to session configuration view -->		
		<v-btn
			class="ma-4"
			color="error"
			@click="newSession()"
		>
			{{ $t('sessionStats.newSession') }}
			<v-icon right>
				mdi-new-box
			</v-icon>
		</v-btn>
  </v-container>
</template>

<script>
export default {
	name: 'SessionStats',
	
	data () {
		return{
			//
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Redirects to session configuration view. 
		*/
		newSession(){
			this.allParticipants = [];
			this.lineChartSelectedMetric = null;
			this.lineChartUsername = null;
			this.showLineChart = false;
			this.$router.push('/settings');
		}
	},

	computed: {
    /*
		@fvillarrealcespedes:
		AllParticipants to display in the right drawer, get and set methods are imported from store.
		*/	    
    allParticipants: {
      get () {
        return this.$store.getters.getAllParticipants;
      },
      set (payload) {
        this.$store.commit('setAllParticipants', payload);
      }
    },
 
		/*
		@fvillarrealcespedes:
		LineChartSelectedMetric for line chart, get and set methods are imported from store.
		*/	
    lineChartSelectedMetric: {
      get (){
        return this.$store.getters.getLineChartSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setLineChartSelectedMetric', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		LineChartUsername for line chart, get and set methods are imported from store.
		*/	
    lineChartUsername: {
      get (){
        return this.$store.getters.getLineChartUsername;
      },      
      set (payload){
        this.$store.commit('setLineChartUsername', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		Array that includes all available performance metrics in NEURONE-AM, get and set methods are imported from store.
		*/	
		metrics: {
			get () {
				return this.$store.getters.getMetrics;
			},
			set (payload) {
				this.$store.commit('setMetrics', payload);
			}
    },      

		/*
		@fvillarrealcespedes:
		Object that includes all sessionsettings, get and set methods are imported from store.
		*/	
		settings: {
			get () {
				return this.$store.getters.getSettings;
			},
			set (payload) {
				this.$store.commit('setSettings', payload);
			}
    },

		/*
		@fvillarrealcespedes:
		Condition to show the line chart, get and set methods are imported from store.
		*/	
    showLineChart: {
      get () {
        return this.$store.getters.getShowLineChart;
      },    
      set (payload){
        this.$store.commit('setShowLineChart', payload);
      }
    }
	}
}
</script>