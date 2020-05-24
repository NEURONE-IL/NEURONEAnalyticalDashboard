<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<Metrics @updateFunction="updateMetrics"/>

					<v-select
						v-model="select"
						:disabled="metrics.length === 0"
						:items="metrics"
						label="Métrica principal"
					></v-select>

					<v-select
						v-model="interval"
						:items="timeOptions"
						label="Intervalo de actualización"
						item-text="text"
						item-value="value"
					>
					</v-select>

				</v-form>		

				<v-btn
					class="mb-4"
					color="success"
					:disabled="!validConfiguration"
					@click="sendConfiguration()"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>		

				<div class="classrooms" ref="chartdiv">
				</div>

      </v-col>
		</v-row>
	</v-container>
</template>

<script>

import Metrics from '../components/Metrics.vue';
import axios from 'axios';

export default {
	name: 'Configuration',

	components: {
		Metrics
	},

	data(){
		return{
			interval: 0,
			limit: 0,
			metrics: [],
			option: '',
			select: 0,
			timeOptions: [
				{value: 10, text: '10 segs'},
				{value: 20, text: '20 segs'},
				{value: 30, text: '30 segs'},
				{value: 60, text: '60 segs'}
			],
			validConfiguration: true
		}
	},

	methods: {
		updateMetrics(checkedMetrics){
			this.metrics = [...checkedMetrics]
		},

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

}
</script>
