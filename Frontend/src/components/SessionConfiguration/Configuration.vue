<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>Configuración de la sesión</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<Metrics :colsSize=4 @updateFunction="updateMetrics"/>
					<br>
					<v-divider></v-divider>	
					<br>				
					<v-row no-gutters>
						<v-col cols="12" md="5" class="text-center ms-12">
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
							<v-switch
								v-model="metricAlert"
								label="¿Activar alertas?"
							>
							</v-switch>
						</v-col>						
						<v-col cols="4" v-if="this.metricAlert">
							<v-select
								v-model="option"
								:items="alertOptions"
								label="Opciones"
								item-text="text"
								item-value="value"
							>
							</v-select>
						</v-col>
						<v-col cols="4" v-if="this.metricAlert">
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
			interval: 0,
			limit: 0,
			metricAlert: false,
			metrics: [],
			option: '',
			select: 0,
			/*Array & Rules*/
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
			selectRules: [
        v => v && v != null || 'Debe seleccionar una opción',
			],
			requiredRules: [
        v => !!v || 'El campo es obligatorio',
			],			
			validConfiguration: true
		}
	},

	methods: {
		updateMetrics(checkedMetrics){
			this.metrics = [...checkedMetrics]
		},

		/*NEURONE-AM*/
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

					console.log("response", response);

					this.$store.commit("setMetrics", {
						configuration: {
							limit: limit,
							metrics: response.data.metrics,
							option: option,
							principal: principal,
						}
					});
					this.$router.push('/classroom');
				})
				.catch(error => {
					console.log(error)
				})
			}
		}, 

		watch: {
			metrics: function(){
				if(this.metrics.length === 0){
					this.select = '';
				}
			}
		}
}
</script>

<style scoped>
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>