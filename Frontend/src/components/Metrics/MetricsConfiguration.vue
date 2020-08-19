<template>
	<v-container>
		<!--Create dialog-->
		<v-dialog
			v-model="createDialog"
			max-width="80%"
			persistent
		>
			<v-card>
				<!-- CreateMetric component -->
				<CreateMetric ref="createMetric"/>
				<v-card-actions>
					<v-spacer></v-spacer>
					<!-- Reset the dialog fields -->
					<v-btn
						color="error"
						@click="resetCreate()"
						class="mb-4 mr-4"            
					>
						{{ $t('buttons.close') }}					
						<v-icon right>
							mdi-close
						</v-icon> 	
					</v-btn>					
				</v-card-actions>					
			</v-card>		
		</v-dialog>

		<!--Update dialog-->
		<v-dialog
			v-model="updateDialog"
			max-width="80%"
			persistent
		>
			<v-card>
				<!-- UpdateMetric component -->
				<UpdateMetric ref="updateMetric"/>
				<v-card-actions>
					<v-spacer></v-spacer>
					<!-- Reset the dialog fields -->
					<v-btn
						color="error"
						@click="resetUpdate()"
						class="mb-4 mr-4"            
					>
						{{ $t('buttons.close') }}					
						<v-icon right>
							mdi-close
						</v-icon> 	
					</v-btn>					
				</v-card-actions>					
			</v-card>		
		</v-dialog>

    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('metricsConfiguration.header') }}</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<v-card>
					<v-card-title>
					<!-- Button to show the create dialog -->
					<v-btn
						color="primary"
						@click="createDialog = true"
					>
						{{ $t('metricsConfiguration.createHeader') }}
						<v-icon dark right>mdi-plus</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						:label="$t('labels.tableSearch')"
						single-line
						hide-details
					></v-text-field>
					</v-card-title>
					<!-- Display all metrics -->
					<v-data-table
						:headers="headers"
						:items="metrics"
						:search="search"
					>
						<template v-slot:item.action="{ item }">		
							<!-- Button to show the selected metric in the UpdateMetric component -->
							<v-btn
								icon
								small
								@click="viewMetric(item._id)"
							>
								<v-icon
									small
								>
									mdi-pencil
								</v-icon> 
							</v-btn>
							<!-- Button to delete the selected metric after confirmation -->							
							<v-btn
								icon
								small
								@click="confirmDelete() && deleteMetric(item._id)"
							>
								<v-icon
									small
								>
									mdi-delete
								</v-icon>
							</v-btn>    
						</template>   
						<template v-slot:item.max="{ item }">
							<!-- Alternative text to show when the metric max property is null -->
							<span v-if="item.max === null">
								{{ $t('metricsConfiguration.nullMax') }}
							</span>
							<span v-else>
								{{ item.max }}
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
import CreateMetric from '../Metrics/CreateMetric';
import UpdateMetric from '../Metrics/UpdateMetric';
import axios from 'axios';
import { mapState } from 'vuex';

export default {
	name: 'MetricsConfiguration',

	components: {
		CreateMetric,
		UpdateMetric
	},

	data (){
		return {
			/*Component properties*/
			metrics: [],
			/*Dialogs properties*/
			createDialog: false,
			updateDialog: false,
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('metricsConfiguration.tableHeaders.name'), value: 'name', align: 'start' },
				{ text: this.$t('metricsConfiguration.tableHeaders.alias'), value: 'alias' },
				{ text: this.$t('metricsConfiguration.tableHeaders.description'), value: 'description' },
				{ text: this.$t('metricsConfiguration.tableHeaders.max'), value: 'max' },
				{ text: this.$t('metricsConfiguration.tableHeaders.dataType'), value: 'dataType' },
				{ text: this.$t('metricsConfiguration.tableHeaders.interval'), value: 'interval'},
				{ text: this.$t('metricsConfiguration.tableHeaders.actions'), value: 'action', sortable: false }
			],
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked whe the DOM is mounted and allows to access the reactive component. Calls the getter method for metrics. 
	*/
	mounted(){
		this.getMetrics();
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Hides the create dialog, calls the getter method for metrics, resets all the CreateMetric component fields. 
		*/			
		resetCreate(){
			this.createDialog = false;
			this.$refs.createMetric.$refs.newMetricForm.reset();
		},

		/*
		@fvillarrealcespedes:
		Hides the update dialog and calls the getter method for metrics. 
		*/
		resetUpdate(){
			this.updateDialog = false;
			this.getMetrics();
		},		

		/*
		@fvillarrealcespedes:
		Sets a confirmation message previous the metric deletion. 
		*/
    confirmDelete(){
			return confirm(this.$t('metricsConfiguration.deleteMetric'));
		},
		
		/*
		@fvillarrealcespedes:
		Sets the selected metric in the UpdateMetric component by getting its _id property, then shows the update dialog.
		*/				
		viewMetric(payload){
			this.metricId = payload;
			this.updateDialog = true;
		},

		/*
		@fvillarrealcespedes:
		Sends a request to get all metrics, then sets metric property as the response data. 
		*/
    async getMetrics(){
      await axios
      .get(this.NEURONE_AD_API_URL + '/metrics')
      .then(response => {
        this.metrics = response.data;
      })
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Sends a request to delete a metric by its _id property, then gets the updated array of metrics.
		*/
		async deleteMetric(payload){
			await axios
			.delete(this.NEURONE_AD_API_URL + '/classroom-configuration/' + payload)
			.then(response => {
				console.log('Done');
				this.getClassroomConfigurations();
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
		MetricId for the UpdateMetric component, get and set methods are imported from the store.
		*/
    metricId: {
      get () {
        return this.$store.getters.getMetricId;
			},			
      set (payload) {
        this.$store.commit('setMetricId', payload);
      },
		},		
	},	
}
</script>

<style scoped>
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>