<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>Configuración de la sesión</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- ConfigureSession form -->
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<!-- Metrics component -->
					<Metrics @updateFunction="updateMetrics"/>
					<br>
					<v-divider></v-divider>	
					<br>				
					<v-row no-gutters>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Principal property selectionable field, disabled when metrics array lenght property is zero -->
							<v-select
								v-model="select"
								:disabled="metrics.length === 0"
								:items="metrics"
								label="Métrica principal"
								required
								:rules="selectRules"								
							></v-select>
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Interval property selectionable field -->
							<v-select
								v-model="interval"
								:items="timeOptions"
								label="Intervalo de actualización"
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
					<v-row>
						<v-col cols="4">
							<!-- MetricAlert property switchable field -->
							<v-switch
								v-model="metricAlert"
								label="¿Activar alertas?"
							>
							</v-switch>
						</v-col>						
						<v-col cols="4" v-if="metricAlert">
							<!-- Option property selectionable field, only visible when metricAlert property is true -->
							<v-select
								v-model="option"
								:items="alertOptions"
								label="Opciones"
								item-text="text"
								item-value="value"
							>
							</v-select>
						</v-col>
						<v-col cols="4" v-if="metricAlert">
							<!-- Limit property input field, only visible when metricAlert property is true -->
							<v-text-field
								v-model="limit"
								label="Valor límite"
								min="0"								
								type="number"
								step="0.01"
							>
							</v-text-field>
						</v-col>	
					</v-row>					
				</v-form>		
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- Button to save the configuration, disabled when there are not at least one selected metric or at least one ConfigureSession form 
				field is invalid -->
				<v-btn
					class="mt-4 mb-4"
					color="success"
					:disabled="!validConfiguration || this.metrics.length === 0"
					@click="sendConfiguration()"
				>
					Aceptar	
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
import Metrics from '../SessionConfiguration/Metrics';
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';

export default {
	name: 'Configuration',

	components: {
		Metrics
	},

	data(){
		return{
			/*Component properties*/
			interval: 0,
			limit: 0,
			metricAlert: false,
			metrics: [],
			option: '',
			select: 0,
			validConfiguration: true,
			/*Arrays & Rules*/
			timeOptions: [
				{value: 10, text: '10 segs'},
				{value: 20, text: '20 segs'},
				{value: 30, text: '30 segs'},
				{value: 60, text: '60 segs'}
			],
			alertOptions: [
				{value: '1', text: 'Mayor que:'},
				{value: '2', text: 'Menor que:'},
			],
			requiredRules: [
        v => !!v || 'El campo es requerido',
			],
			selectRules: [
        v => v && v != null || 'Debe seleccionar una opción'
			]						
		}
	},

	created(){
		this.isInit();	
		this.initTime = null;
	},

	methods: {
		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, captures the selected metrics from the Metric component. Called my emit. 
		*/		
		updateMetrics(checkedMetrics){
			this.metrics = [...checkedMetrics]
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, sends a request to configure a new session. First composes a configuration data object with the 
		component properties, then sends the request and when the response is recived saves the session configuration to store and 
		finally if everything works redirects to classroom view.
		*/
		async sendConfiguration(){			
			let interval = this.interval * 1000;
			let limit = this.limit;
			let metrics = this.metrics;
			let option = this.option;
			let principal = this.select;
			let configuration = {
				interval,
				limit,
				metrics,
				option,
				principal
			};
			await axios
			.post(`${process.env.VUE_APP_API_URL}/configure`, configuration)
			.then(response => {
				this.configuration = {
					interval: interval,
					limit: limit,
					metrics: response.data.metrics,
					option: option,
					principal: principal,
				}
				this.$router.push('/classroom');
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		async isInit(){
			await axios
			.get(`${process.env.VUE_APP_API_URL}/ifsession`)
			.then(response => {
				if(response.data.status){
					this.endSession();
				}
			})
			.catch(error => {
				console.log(error.message);
			});
		},

    async endSession(){
			await axios
			.get(`${process.env.VUE_APP_API_URL}/endsession`)
			.then(response => {
				this.configuration = null;
      })
			.catch(error => {
				console.log(error.message);
			});
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the metric array lenght property, in case that that value is zero sets the select property as an empty string.
		*/				
		metrics: function(){
			if(this.metrics.length === 0){
				this.select = '';
			}
		}
	},

	computed: {
		configuration: {
			get () {
				return this.$store.getters.getConfiguration;
			},
			set (payload) {
				this.$store.commit('setConfiguration', payload);
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
</style>