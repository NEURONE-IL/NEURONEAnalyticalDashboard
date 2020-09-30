<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2> {{ $t('settings.header') }} </h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- SessionSettings form -->
				<v-form
					ref="settingsForm"
					v-model="validSettings"
				>
					<h3 class="title">{{ $t('metrics.header') }}:</h3>
					<v-row no-gutters justify="center">
						<!-- V-for loop to display all availables metric --> 
						<v-col 
							v-for="(metric, i) in sortMetrics(metrics)" :key="i"
							md="4"
							sm="6"
							xs="12"
						>
							<v-row>
								<!-- For each metric sets a switch to add the metric or remove from the selectedMetrics array -->
								<v-switch
									v-model="selectedMetrics"
									:label="metric.alias"
									:value="metric"
								>
								</v-switch>
								<v-tooltip 
									bottom
									nudge-bottom="-20"
									max-width="20%"
									color="primary"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											class="ml-4"
											color="primary"
											dark
											left
											v-bind="attrs"
											v-on="on"
										>
											mdi-information
										</v-icon>
									</template>
									<span> {{ metric.descriptions[setSimpleLocale()] || metric.descriptions['en'] }}</span>
								</v-tooltip>
							</v-row>
						</v-col>
					</v-row>
					<br>
					<v-divider></v-divider>	
					<br>				
					<v-row no-gutters>
						<v-col cols="5" xs="12" md="5" class="text-center ms-12">
							<!-- Principal property selectionable field, disabled when metrics array lenght property is zero -->
							<v-select				
								v-model="principal"
								:disabled="selectedMetrics.length === 0"
								:items="sortMetrics(selectedMetrics)"
								:label="$t('settings.principal')"
								required
								item-text="alias"
								return-object
								:rules="selectRules"
							>
							<template v-slot:item="{ item }">
								<span> {{ item.alias }} </span>
							</template>
							</v-select>
						</v-col>
						<v-col cols="5" xs="12" md="5" class="text-center ms-12">
							<!-- Interval property selectionable field -->
							<v-select
								v-model="interval"
								:items="timeOptions"
								:label="$t('settings.interval')"
								item-text="text"
								item-value="value"
								required
								:rules="selectRules"								
							>
							</v-select>
						</v-col>					
					</v-row>
					<br>
					<v-divider></v-divider>	
					<br>			
					<v-row v-if="principal">
						<v-col cols="4" xs="12">
							<!-- MetricAlert property switchable field -->
							<v-switch
								v-model="metricAlert"
								:label="$t('settings.activeAlert')"
							>
							</v-switch>
						</v-col>						
						<v-col cols="4" xs="12" v-if="metricAlert">
							<!-- Option property selectionable field, only visible when metricAlert property is true -->
							<v-select
								v-model="option"
								:items="alertOptions"
								:label="$t('settings.alertOption')"
								item-text="text"
								item-value="value"
								required
								:rules="selectRules"									
							>
							</v-select>
						</v-col>
						<v-col cols="4" xs="12" v-if="metricAlert">
							<!-- Limit property input field, only visible when metricAlert property is true -->
							<v-text-field
								v-model="limit"
								:label="$t('settings.limit')"
								min="0"	
								:max="principal.max"
								:step="principal.interval"
								:hint="setHint()"
								persistent-hint
								type="number"
								:rules="limitRules"									
							>
							</v-text-field>
						</v-col>	
					</v-row>					
				</v-form>		
				<v-row v-if="validSettings">
					<v-col cols="4" xs="12" class="text-center">
						<v-switch				
							v-model="saveSettings"
							:label="$t('settings.saveSettings')"
						>
						</v-switch>
					</v-col>
					<v-col cols="4" xs="12" class="text-center">
						<!-- Interval property selectionable field -->
						<v-text-field
							v-model="settingsName"
							v-if="saveSettings"
							:label="$t('labels.name')"
							:rules="requiredRules"
						>
						</v-text-field>
					</v-col>					
				</v-row>				
				<br>
				<v-divider v-if="principal"></v-divider>	
				<br>	
				<!-- Button to save the settings, disabled when there are not at least one selected metric or at least one ConfigureSession form 
				field is invalid -->
				<v-btn
					class="mt-4 mb-4"
					color="success"
					:disabled="!validSettings || selectedMetrics.length === 0 || (saveSettings && !validSettingsName())"
					@click="processSettings()"
				>
					{{ $t('buttons.accept') }}	
					<v-icon right>
						mdi-check
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
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
import { stringify } from '@amcharts/amcharts4/.internal/core/utils/Utils';

export default {
	name: 'Settings',

	data(){
		return{
			/*Component properties*/
			interval: 0,
			limit: 0,
			metricAlert: false,
			option: '',
			principal: '',
			selectedMetrics: [],
			saveSettings: false,
			validSettings: true,
			settingsName: '',
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
        v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule')
			],
			selectRules: [
        v => (v && v != null) || this.$t('rules.selectRule')
			],
			limitRules: [
				v => (!!v && v > 0) || this.$t('rules.limitRule')
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

		setSimpleLocale(){
			var locale;
			locale = this.$i18n.locale.split('-')[0];
			console.log(locale)
			return locale;
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
		},		

		setHint(){
			if(this.principal.max){
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.principal.max;
			}else{
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.$t('settings.undefined');
			}
		},

		validSettingsName(){
			if(!(/\S/.test(this.settingsName)) || this.settingsName.length < 5){
				return false;
			}
			return true;
		},
		

		async processSettings(){
			if(this.saveSettings){
				let backendMetrics = [];
				this.sortMetrics(this.selectedMetrics).forEach(element => {
					backendMetrics.push(element.name)
				})
				let interval = this.interval * 1000;
				let limit = this.limit;
				let metrics = backendMetrics;
				let option = this.option;
				let principal = this.principal.name;
				let name = this.settingsName;
				let settings = {
					interval,
					limit,
					metrics,
					option,
					principal, 
					name
				};
				await axios
				.post(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}/session-settings`, settings)
				.then(response => {
					this.dispatchNotification('sessionSettings.createSuccess', 'check-circle', 5000, 'success');
					this.getSessionSettings();
					this.goSettings(settings);
				})
				.catch(error => {
					this.dispatchNotification('sessionSettings.createError', 'check-circle', 5000, 'error');
					console.log(error.response);
				})
			}else{
				this.sendSettings();
			}
		},

		async goSettings(settings){
			console.log(settings, 'go')
			let interval = settings.interval;
			let limit = settings.limit;
			let metrics = settings.metrics;
			let option = settings.option;
			let principal = settings.principal;
			let newSettings = {
				interval,
				limit,
				metrics,
				option,
				principal, 
			};			
			await axios
			.post(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/configure`, newSettings)
			.then(response => {
				this.settings = {
					limit: limit,
					metrics: response.data.metrics,
					option: option,
					principal: principal,
				}
				localStorage.setItem('settings', JSON.stringify(newSettings));
				this.$router.push('/classroom');
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, sends a request to configure a new session. First composes a settings data object with the 
		component properties, then sends the request and when the response is recived saves the session settings to store and 
		finally if everything works redirects to classroom view.
		*/
		async sendSettings(){
			let backendMetrics = [];
			this.sortMetrics(this.selectedMetrics).forEach(element => {
				backendMetrics.push(element.name)
			})
			console.log(backendMetrics)
			let interval = this.interval * 1000;
			let limit = this.limit;
			let metrics = backendMetrics;
			let option = this.option;
			let principal = this.principal.name;
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
			return metrics.sort( compare );
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