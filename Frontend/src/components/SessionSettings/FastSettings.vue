<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<v-card>
					<v-card-title>
						{{ $t('fastSettings.tableTitle') }}
						<v-spacer></v-spacer>
						<!-- Data table search imput field -->
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							:label="$t('labels.tableSearch')"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<!-- Data table to display all sessionSettings -->
					<v-data-table
						:headers="headers"
						:items="sessionSettings"
						:search="search"
					>
						<template v-slot:[`item.action`]="{ item }">		
							<!-- Button to delete the selected sessionSettings after confirmation -->
							<v-btn
								icon
								color="error"
								@click="confirmDelete() && deleteSessionSettings(item._id)"
							>
								<v-icon
								>
									mdi-delete
								</v-icon>
							</v-btn>    
							<!-- Button to select and use the selected sessionSettings after confirmation -->
							<v-btn
								icon
								color="success"
								@click="confirmContinue() && processSettings(item)"
							>
								<v-icon
								>
									mdi-arrow-right-thick	
								</v-icon>
							</v-btn>    
						</template> 
						<!-- Alert template slot -->
						<template v-slot:[`item.limit`]="{ item }">
							<span>
								{{ setAlert(item) }}
							</span>
						</template>
						<!-- Principal template slot -->
						<template v-slot:[`item.principal`]="{ item }">
							<span>
								{{ setAlias(item.principal) }}
							</span>
						</template>
						<!-- Metrics template slot -->
						<template v-slot:[`item.metrics`]="{ item }">
							<span>
								{{ setMetrics(item.metrics) }}
							</span>
						</template>						
						<!-- Update interval template slot -->
						<template v-slot:[`item.interval`]="{ item }">
							<span>
								{{ setInterval(item.interval) }}
							</span>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
import { stringify } from '@amcharts/amcharts4/.internal/core/utils/Utils';

export default {
	name: 'FastSettings',

	data(){
		return{
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('fastSettings.tableHeaders.name'), value: 'name', align: 'start'},
				{ text: this.$t('fastSettings.tableHeaders.metrics'), value:'metrics' },
				{ text: this.$t('fastSettings.tableHeaders.principal'), value:'principal' },
				{ text: this.$t('fastSettings.tableHeaders.alert'), value: 'limit' },
				{ text: this.$t('fastSettings.tableHeaders.updateInterval'), value:'interval' },
				{ text: this.$t('fastSettings.tableHeaders.actions'), value: 'action', sortable: false }
			],			
			/*Arrays*/
			timeOptions: [
				{value: 10, text: '10 '},
				{value: 20, text: '20 '},
				{value: 30, text: '30 '},
				{value: 60, text: '60 '}
			]
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked before the rendering. Sets sessionInitTime property null.
	*/
	created(){
		this.sessionInitTime = null;
		this.tabs[0].disabled = false;
		this.tabs[1].disabled = true;
		this.tabs[2].disabled = false;
		this.tabs[3].disabled = false;
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Methods imported from store.
		*/			
		...mapActions([
			'getSessionSettings'
		]),		

		/*
		@fvillarrealcespedes:
		Sets a confirmation message previous the sessionSettings use. 
		*/	
		confirmContinue(){
    	return confirm(this.$t('fastSettings.loadSettings'))
		},

		/*
		@fvillarrealcespedes:
		Sets a confirmation message previous the sessionSettings deletion. 
		*/	
		confirmDelete(){
    	return confirm(this.$t('fastSettings.deleteSettingsConfirmation'))
		},

		/*
		@fvillarrealcespedes:
		Sends a request to delete a specific sessionSettings by its _id property, then gets the updated sessionSettings array.
		*/
		async deleteSessionSettings(payload){
			await axios
			.delete(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/session-settings/' + payload)
			.then(response => {
				this.getSessionSettings();
				this.dispatchNotification('sessionSettings.deleteSuccess', 'check-circle', 5000, 'success');
			})	
      .catch(error => {
				console.log(error);
				this.dispatchNotification('sessionSettings.deleteError', 'close-circle', 5000, 'error');
      })
		},

		/*
		@fvillarrealcespedes:
		Composes and send to store a notification object to be displayed for the user. The icon, text, timeout and color properties depends on the type 
		of message that want to display.
		*/
		dispatchNotification(text, icon, timeout, color){
			let notification = {
				show: true,
				icon: 'mdi-' + icon,
				text: 'notifications.' + text,
				timeout: timeout,
				color: color
			}
			this.$store.dispatch('showNotification', notification)
		},			

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, sends a request to configure a new session. First composes a settings data object with the 
		component properties, then sends the request and when the response is recived saves the session settings to store and 
		finally if everything works redirects to classroom view.
		*/
		async processSettings(item){
			let interval = item.interval;
			let limit = item.limit;
			let metrics = item.metrics;
			let option = item.option;
			let principal = item.principal;
			let settings = {
				interval,
				limit,
				metrics,
				option,
				principal
			};
			await axios
			.post(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/configure`, settings)
			.then(response => {
				this.settings = {
					limit: limit,
					metrics: response.data.metrics,
					option: option,
					principal: principal,
				}
				localStorage.setItem('settings', JSON.stringify(settings));
				this.$router.replace('/classroom');
			})
			.catch(error => {
				console.log(error);
			})
		},

		/*
		@fvillarrealcespedes:
		Composes an alert for a sessionSettings by its option, principal and limit properties.
		*/	
		setAlert(item){
			var option;
			switch (item.option) {
				case "1":
					option = '>';
					break;
				case "2":
					option = '<';
				default:
					return this.$t('settings.undefined');
					break;
			}
			return this.setAlias(item.principal) + ' ' + option + ' ' + item.limit;
		},

		/*
		@fvillarrealcespedes:
		Searches in metrics array the metric object where name property equals the given name param, then returns that object alias.
		*/
    setAlias(name){
      var metric = this.metrics.find(metric => metric.name === name);
      return metric.alias;
		},	

		/*
		@fvillarrealcespedes:
		Composes an interval update for a sessionSettings by its option and an interval param.
		*/		
		setInterval(interval){
			interval /= 1000;
			var timeOption = this.timeOptions.find(option => option.value === interval);
			return timeOption.text + this.$t('settings.seconds');
		},

		/*
		@fvillarrealcespedes:
		Formats the metrics array param into a single string to display it on the data table.
		*/
		setMetrics(metrics){
			var formattedMetrics = [];
			this.sortMetrics(metrics).forEach(metric => {
				formattedMetrics.push(this.setAlias(metric))
			})
			return formattedMetrics.toString().replace(/,/g, ', ');
		},

		/*
		@fvillarrealcespedes:
		Gets locale from i18n plugin and gets the ISO 639-1 code of it. 
		*/
		setSimpleLocale(){
			var locale;
			locale = this.$i18n.locale.split('-')[0];
			return locale;
		},

		/*
		@fvillarrealcespedes:
		Sorts the array metrics elements alphabetically by their alias.
		*/
		sortMetrics(metricsArray){
			let metrics = [...metricsArray];
			function compare ( a, b ){ return a.alias > b.alias ? 1 : -1; };
			return metrics.sort( compare );
		}
	},

	computed: {
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
		Array that includes all custom sessionSettings, get and set methods are imported from store.
		*/			
		sessionSettings: {
			get () {
				return this.$store.getters.getSessionSettings;
			},
			set (payload) {
				this.$store.commit('setSessionSettings', payload);
			}
		},

		/*
		@fvillarrealcespedes:
		SessionInitTime, get and set methods are imported from store.
		*/
		sessionInitTime: {
			get () {
				return this.$store.getters.getSessionInitTime;
			},
			set (payload) {
				this.$store.commit('setSessionInitTime', payload);
			}
		},	
		
		/*
		@fvillarrealcespedes:
		Object that includes all session settings, get and set methods are imported from store.
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
		Left drawer tabs, get and set methods are imported from store.
		*/		
		tabs: {
      get () {
        return this.$store.getters.getTabs;
      },
      set (payload) {
        this.$store.commit('setTabs', payload);
      },
		}			
	}
}
</script>

<style scoped>
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
.title{
	text-align: left;
}
</style>