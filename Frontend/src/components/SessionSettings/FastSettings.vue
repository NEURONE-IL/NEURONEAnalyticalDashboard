<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('fastSettings.header') }}</h2>
				<v-divider></v-divider>	
				<br>	
				<v-card>
					<v-card-title>
						Configuraciones
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							:label="$t('labels.tableSearch')"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<!-- Display all custom classroom configurations -->
					<v-data-table
						:headers="headers"
						:items="sessionSettings"
						:search="search"
					>
						<template v-slot:item.action="{ item }">		
							<!-- Button to delete the selected classroom configuration after confirmation -->
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

							<!-- Button to delete the selected classroom configuration after confirmation -->
							<v-btn
								icon
								color="success"
								@click="confirmContinue() && sendSettings(item)"
							>
								<v-icon
								>
									mdi-arrow-right-thick	
								</v-icon>
							</v-btn>    
						</template> 

						<template v-slot:item.limit="{ item }">
							<span>
								{{ setAlert(item) }}
							</span>
						</template>

						<template v-slot:item.principal="{ item }">
							<span>
								{{ setAlias(item.principal) }}
							</span>
						</template>

						<template v-slot:item.metrics="{ item }">
							<span>
								{{ setMetrics(item.metrics) }}
							</span>
						</template>						

						<template v-slot:item.interval="{ item }">
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
			/*Component properties*/
			interval: 0,
			limit: 0,
			metricAlert: false,
			option: '',
			principal: '',
			selectedMetrics: [],
			validSettings: true,
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('fastSettings.tableHeaders.name'), value: 'name', align: 'start'},
				//{ text: this.$t('fastSettings.tableHeaders.createdBy'), value:'createdBy' },
				{ text: this.$t('fastSettings.tableHeaders.metrics'), value:'metrics' },
				{ text: this.$t('fastSettings.tableHeaders.principal'), value:'principal' },
				{ text: this.$t('fastSettings.tableHeaders.alert'), value: 'limit' },
				{ text: this.$t('fastSettings.tableHeaders.updateInterval'), value:'interval' },
				{ text: this.$t('fastSettings.tableHeaders.actions'), value: 'action', sortable: false }
			],			
			/*Arrays & Rules*/
			timeOptions: [
				{value: 10, text: '10 s'},
				{value: 20, text: '20 s'},
				{value: 30, text: '30 s'},
				{value: 60, text: '60 s'}
			],
			alertOptions: [
				{value: '1', text: this.$t('settings.alertOptions.higher')},
				{value: '2', text: this.$t('settings.alertOptions.lower')},
			],
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
			selectRules: [
        v => (v && v != null) || this.$t('rules.selectRule')
			]			
		}
	},

	created(){
		this.initTime = null;
	},

	methods: {
		...mapActions([
			'getSessionSettings'
		]),		

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

		setSimpleLocale(){
			var locale;
			locale = this.$i18n.locale.split('-')[0];
			console.log(locale)
			return locale;
		},

		setHint(){
			if(this.principal.max){
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.principal.max;
			}else{
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.$t('settings.undefined');
			}
		},

    setAlias(name){
      var metric = this.metrics.find(metric => metric.name === name);
      return metric.alias;
		},		
		
		setInterval(interval){
			interval /= 1000;
			var timeOption = this.timeOptions.find(option => option.value === interval);
			return timeOption.text;
		},

		confirmDelete(){
    	return confirm(this.$t('fastSettings.deleteSettings'))
		},

		confirmContinue(){
    	return confirm(this.$t('fastSettings.loadSettings'))
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, sends a request to configure a new session. First composes a settings data object with the 
		component properties, then sends the request and when the response is recived saves the session settings to store and 
		finally if everything works redirects to classroom view.
		*/
		async sendSettings(item){
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
				this.$router.push('/classroom');
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		sortMetrics(metricsArray){
			let metrics = [...metricsArray];
			function compare ( a, b ){ return a.alias > b.alias ? 1 : -1; };
			console.log(metrics.sort( compare ), 'sort')
			return metrics.sort( compare );
		},

		setMetrics(metrics){
			var formattedMetrics = [];
			this.sortMetrics(metrics).forEach(metric => {
				formattedMetrics.push(this.setAlias(metric))
			})
			return formattedMetrics.toString().replace(/,/g, ', ');
		},

		async createSettings(){
			let backendMetrics = [];
			this.sortMetrics(this.selectedMetrics).forEach(element => {
				backendMetrics.push(element.name)
			})
			await axios
			.post(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/session-settings', {
				name: this.name,
				createdBy: this.createdBy,
				participants: this.principal,
				interval: this.interval,
				option: this.option,
				metrics: backendMetrics
			})
			.then(response => {
				console.log('success', response.data)
				this.getSessionSettings();
				this.dispatchNotification('fastSettings.createSuccess', 'check-circle', 5000, 'success');
			})
      .catch(error => {
				console.log(error.response);
				this.dispatchNotification('fastSettings.createError', 'close-circle', 5000, 'error');
      })
		},		

		/*
		@fvillarrealcespedes:
		Sends a request to delete a specific session settings by its _id property, then gets the updated array of session settings.
		*/
		async deleteSessionSettings(payload){
			await axios
			.delete(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/session-settings/' + payload)
			.then(response => {
				this.getSessionSettings();
				this.dispatchNotification('fastSettings.deleteSuccess', 'check-circle', 5000, 'success');
			})	
      .catch(error => {
				console.log(error.response);
				this.dispatchNotification('fastSettings.deleteError', 'close-circle', 5000, 'error');
      })
		},

		dispatchNotification(text, icon, timeout, color){
			let notification = {
				show: true,
				icon: 'mdi-' + icon,
				text: 'notifications.' + text,
				timeout: timeout,
				color: color
			}
			this.$store.dispatch('showNotification', notification)
		}		

	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the metric array lenght property, in case that that value is zero sets the principal property as an empty string.
		*/				
		selectedMetrics: function(){
			if(this.selectedMetrics.length === 0){
				this.principal = '';
			}
		},

		principal: function(){
			if(this.option){
				if(this.principal.max){
					this.limit = this.principal.max/2;
				}
				else{
					this.limit = 1;
				}
			}
		}
	},

	computed: {
		sessionSettings: {
			get () {
				return this.$store.getters.getSessionSettings;
			},
			set (payload) {
				this.$store.commit('setSessionSettings', payload);
			}
		},

		settings: {
			get () {
				return this.$store.getters.getSettings;
			},
			set (payload) {
				this.$store.commit('setSettings', payload);
			}
		},

		metrics: {
			get () {
				return this.$store.getters.getMetrics;
			},
			set (payload) {
				this.$store.commit('setMetrics', payload);
			}
		},		

		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
			}
		},		
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