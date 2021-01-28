<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('sessionStats.header') }}</h2>
				<v-divider></v-divider>	
				<br>
				<div class="mt-4 mb-4 statsCard">
					<v-card>
						<v-row class="text-center">
							<v-col cols="4">
								<!-- Participants quantity -->
								<span>
									{{ $t('sessionStats.participants') }}: {{this.sessionParticipants}}
								</span>
							</v-col>
							<v-col cols="4">
								<!-- Principal metric -->
								<span>
									{{ $t('sessionStats.principal') }}: {{this.setAlias(this.settings.principal)}}
								</span>
							</v-col>
							<v-col cols="4">
								<!-- Metric limit value -->
								<span>
									{{ $t('sessionStats.sessionTime') }}: {{this.sessionTime}}
								</span>
							</v-col>				
						</v-row>
					</v-card>					
				</div>
				<!-- Bar chart card -->
				<v-card class="chartCard">
					<BarChart/>
				</v-card>
				<!-- Button to go back to classroom view -->		
				<v-btn
					class="mr-4 ml-4 mt-8"
					color="info"
					@click="$router.replace('/classroom')"
				>
					{{ $t('buttons.resumeSession') }}
					<v-icon right>
						mdi-arrow-left
					</v-icon>
				</v-btn>
				<!-- Button to go to session settings view -->		
				<v-btn
					class="mr-4 ml-4 mt-8"
					color="success"
					@click="newSession()"
				>
					{{ $t('buttons.newSession') }}
					<v-icon right>
						mdi-new-box
					</v-icon>
				</v-btn>
			</v-col>
		</v-row>
  </v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import BarChart from '../Classroom/BarChart';
import axios from 'axios';

export default {
	name: 'SessionStats',
	
	components: {
		BarChart
	},
	
	data () {
		return{
			/*Component properties*/
			sessionTime: ''
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked when the DOM is mounted and allows to access the reactive component. Calls the method to get the session time. 
	*/
	mounted(){
		this.showSessionTime();
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Searches in metrics array the metric object where name property equals the given name param, then returns that object alias.
		*/
    setAlias(name){
			var metric = this.metrics.find(metric => metric.name == name);
      return metric.alias;
    },

		/*
		@fvillarrealcespedes:
		Gets the actual time in milliseconds, gets the hours, minutes and seconds, then formates it to "hh:mm:ss" to display. Also calculates 
		the session time comparing the session init time and the actual time, then formates it to "hh:mm:ss" to display. 
		*/
		showSessionTime(){
			var currentDate = new Date();
			/*Gets the session init time and difference with current date*/
			var initDate = new Date(this.initTime);
			var dateDifference = Math.round((currentDate.getTime() - initDate.getTime())/1000);
			/*Gets the date difference hours, minutes and seconds. Respective division and module operations are apply*/
			var sh = parseInt((dateDifference/3600));
			var sm = parseInt((dateDifference/60)%60);
			var ss = parseInt(dateDifference%60);
			/*Puts a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			sh = (sh < 10) ? "0" + sh : sh;
			sm = (sm < 10) ? "0" + sm : sm;
			ss = (ss < 10) ? "0" + ss : ss;			
			this.sessionTime = sh + ":" + sm + ":" + ss + " ";
		},

		/*
		@fvillarrealcespedes:
		Sends a request to end the current session, then sets to null some store properties and finally redirects to session settings view. 
		*/
    async newSession() {
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/endsession`)
			.then(response => {
				this.$store.commit('destroySettings');
				this.$router.replace('/settings');
      });
    }
	},

	computed: {
		/*
		@fvillarrealcespedes:
		Session init time, get and set methods are imported from store.
		*/		
		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
			},
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
		SessionParticipants, get and set methods are imported from store.
		*/	    
    sessionParticipants: {
      get () {
        return this.$store.getters.getSessionParticipants;
      },
      set (payload) {
        this.$store.commit('setSessionParticipants', payload);
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
    }
	}
}
</script>

<style scoped>
.chartCard{
	max-width: 75%;
	left: 12.5%;
}
.statsCard{
	max-width: 75%;
	margin-left: 12.5%;	
}
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>