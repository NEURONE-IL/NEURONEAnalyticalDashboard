<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('metricsConfiguration.updateHeader') }}</h2>
				<br>
				<v-divider></v-divider>	
				<br>		
				<!-- UpdateMetric form -->		
				<v-form
					ref="editMetricForm"
					v-model="editValidMetric"
				>
					<v-row no-gutters>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Name property input field -->
							<v-text-field
								v-model="metric.name"
								:label="$t('labels.name')"
								required
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Alias property input field -->
							<v-text-field
								v-model="metric.alias"
								:label="$t('labels.alias')"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>
						</v-col>							
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Description property input field -->
							<v-text-field
								v-model="metric.description"
								:label="$t('labels.description')"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- DataType property selectionable field -->
							<v-select
								v-model="metric.dataType"
								:items="dataTypeOptions"
								:label="$t('labels.dataType')"
								required
								:rules="selectRules"								
							>
							</v-select>	
						</v-col>	
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- HasMax property switchable field -->
							<v-switch
								v-model="hasMax"
								:label="$t('labels.hasMax')"
							>
							</v-switch>							
						</v-col>											
						<v-col cols="12" md="5" class="text-center ms-12" v-if="hasMax">
							<!-- Max property input field, only visible when hasMax property is true -->
							<v-text-field
								v-model="metric.max"
								:label="$t('labels.max')"
								required
								:rules="requiredRules"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
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
				<!-- Button to update the metric, disabled when there are not changes or at least one UpdateMetric form field is invalid -->
				<v-btn
					class="mb-4 ms-4"
					color="success"
					:disabled="!hasChange || !editMetricForm"
					@click="updateMetric(metricId)"
				>
					{{ $t('buttons.saveChanges') }}
					<v-icon right>
						mdi-content-save
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
import { mapState } from 'vuex';

export default {
	name: 'UpdateMetric',

	data (){
		return {
			/*Component properties*/
			metric: {},
			hasChange: false,
			changesCounter: 0,
			editValidMetric: true,
			/*Arrays & rules*/
			dataTypeOptions: [
				'Decimal',
				'Entero'
			],			
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
			selectRules: [
        v => v && v != null || this.$t('rules.selectRule')
			]			
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked after create, calls the getter method for a specific metric by the computed property metricId.
	*/
	mounted(){
		this.getMetric(this.metricId);
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Sends a request to get a specific metric by its _id property, then sets the metric property as the response data.
		*/
    async getMetric(payload){
      await axios
      .get(this.NEURONE_AD_API_URL + '/metric/' + payload)
      .then(response => {
				this.metric = response.data;
				console.log(response.data);
      })
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Sends a request to update a specific metric by its _id property. Uses directly four inputable and selectable component properties, name, 
		alias, description and max to update the metric data object, also using some of these properties defines two others, min and interval.
		*/
		async updateMetric(payload){		
			await axios
			.put(this.NEURONE_AD_API_URL + '/metric/' + payload, {
				name: this.metric.name,
				alias: this.metric.alias,
				description: this.metric.description,
				max: this.metric.max,
				min: this.metric.min,
				dataType: this.metric.dataType,
				interval: this.this.metric.interval
			})
			.then(response => {
				//
			})
      .catch(error => {
        console.log(error.response);
      })
		},
	},

	computed:{
		/*
		@fvillarrealcespedes:
		NEURONE-AD backend URL. 
		*/		
		...mapState(['NEURONE_AD_API_URL']),
		
		/*
		@fvillarrealcespedes:
		MetricId for the UpdateMetric component, get method is imported from the store.
		*/  		
    metricId: {
      get () {
        return this.$store.getters.getMetricId;
			}
		},	
	},		

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the metricId property to get the specified metric immediately when changes.
		*/			
		metricId: function(){
			this.changesCounter = 0;
			this.hasChange = false;			
			this.getMetric(this.metricId);			
		},

		/*
		@fvillarrealcespedes:
		Watches the metric object property and the eventual changes on it to set enable the update button.
		*/
		metric: {
			deep: true,
						
			handler: function(){
				if(this.changesCounter != 0){
					this.hasChange = true;
				}
				this.changesCounter++;
			}
		}
	},
}
</script>

<style scoped>
.classrooms {
  width: 100%;
}
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>