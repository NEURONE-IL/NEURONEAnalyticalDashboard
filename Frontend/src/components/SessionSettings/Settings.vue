<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<!-- SessionSettings form -->
				<v-form
					ref="settingsForm"
					v-model="validSettings"
				>
					<h3 class="title">{{ $t('metrics.header') }}:</h3>
					<v-row no-gutters justify="center">
						<!-- V-for loop to display all availables metrics --> 
						<v-col 
							v-for="(metric, i) in sortMetrics(metrics)" :key="i"
							md="4"
							sm="6"
							xs="12"
						>
							<v-row>
								<!-- For each metric sets a switch to add the metric or remove it from the selectedMetrics array -->
								<v-switch
									v-model="selectedMetrics"
									:label="metric.alias"
									:value="metric"
								>
								</v-switch>
								<!-- A tooltip is displayed to show the each metric description -->
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
									<!-- Metrics description language depends on i18n locale property, by default its English -->
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
							<!-- Shows the NEURONE-AD metric alias, not the NEURONE-AM metric name -->
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
					<!-- Showed when principal property is selected -->
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
				<!-- Showed when validSettings property is true -->
				<v-row v-if="validSettings">
					<v-col cols="4" xs="12" class="text-center">
						<v-switch				
							v-model="saveSettings"
							:label="$t('settings.saveSettings')"
						>
						</v-switch>
					</v-col>
					<v-col cols="4" xs="12" class="text-center">
						<!-- SettingsName property input field, used to store the current sessionSettings -->
						<v-text-field
							v-model="settingsName"
							v-if="saveSettings"
							:label="$t('labels.name')"
							:rules="requiredRules"
							:counter="50"
						>
						</v-text-field>
					</v-col>					
				</v-row>				
				<br>
				<v-divider v-if="principal"></v-divider>	
				<br>	
				<!-- Button to save the current sessionSettings, disabled when there are not at least one selected metric or whent at least one 
				SettingsForm form field is invalid -->
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
			/*Arrays*/
			alertOptions: [
				{value: '1', text: this.$t('settings.alertOptions.higher')},
				{value: '2', text: this.$t('settings.alertOptions.lower')},
			],
			timeOptions: [
				{value: 10, text: '10 ' + this.$t('settings.seconds')},
				{value: 20, text: '20 ' + this.$t('settings.seconds')},
				{value: 30, text: '30 ' + this.$t('settings.seconds')},
				{value: 60, text: '60 ' + this.$t('settings.seconds')}
			],
			/*Rules*/
			limitRules: [
				v => (!!v && v > 0) || this.$t('rules.limitRule')
			],			
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule')
			],
			selectRules: [
        v => (v && v != null) || this.$t('rules.selectRule')
			]
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked before the rendering. Sets initTime property null.
	*/
	created(){
		this.initTime = null;
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
		Sends a request to store a new sessionSettings object, given the object itself and a name to identify it. If all works correctly,
		the getSessionSettings method is called to update the sessionSettings array in store. Finally, redirects to Classroom view.
		*/		
		async createSettings(name, settings){
			settings.name = name;
			await axios
			.post(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}/session-settings`, settings)
			.then(response => {
				this.dispatchNotification('sessionSettings.createSuccess', 'check-circle', 5000, 'success');
				this.getSessionSettings();
				this.$router.replace('/classroom');
			})
			.catch(error => {
				this.dispatchNotification('sessionSettings.createError', 'check-circle', 5000, 'error');
				console.log(error.response);
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
		NEURONE-AM original method, sends a request to configure a new session. First composes a settings data object with the component 
		properties, then sends the request and when the response is recived saves the sessionSettings to store. Additionally for NEURONE-AD, 
		in case the user want to store the sessionSettings for future sessions the createSettings method is called, if not redirects to 
		Classroom view.
		*/		
		async processSettings(){
			let backendMetrics = [];
			this.sortMetrics(this.selectedMetrics).forEach(element => {
				backendMetrics.push(element.name);
			});
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
				principal, 
			}
			/*Axios requests*/
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
				/*If user selects to save the sessionSettings*/
				if(this.saveSettings){
					this.createSettings(this.settingsName, settings);
				}else{
					this.$router.replace('/classroom');
				}
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		/*
		@fvillarrealcespedes:
		Sets a hint for limit property input field, depending on metrics max property.
		*/
		setHint(){
			if(this.principal.max){
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.principal.max;
			}else{
				return this.$t('settings.maxHint') + ' ' + this.principal.alias + ': ' + this.$t('settings.undefined');
			}
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
		},		

		/*
		@fvillarrealcespedes:
		Checks if the new sessionSettings object to store has a valid name, two rules are applied: isn't just spaces and its length
		is at least of 5 characters.
		*/
		validSettingsName(){
			if(!(/\S/.test(this.settingsName)) || this.settingsName.length < 5){
				return false;
			}
			return true;
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

		/*
		@fvillarrealcespedes:
		Watches the principal object max property to update the limit property.
		*/		
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
		/*
		@fvillarrealcespedes:
		Session InitTime, get and set methods are imported from store.
		*/	
		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
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
