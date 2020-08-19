<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('metricsConfiguration.createHeader') }}</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- CreateMetric form -->
				<v-form
					ref="newMetricForm"
					v-model="newValidMetric"
				>
					<v-row no-gutters>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Name property input field -->
							<v-text-field
								v-model="name"
								:label="$t('labels.name')"
								required
								:rules="nameRequiredRules"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>					
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Alias property input field -->
							<v-text-field
								v-model="alias"
								:label="$t('labels.alias')"
								required
								:rules="requiredRules"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>					
						</v-col>	
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- Description property input field -->
							<v-text-field		
								v-model="description"
								:label="$t('labels.description')"
								required
								:rules="requiredRules"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>					
						</v-col>	
						<v-col cols="12" md="5" class="text-center ms-12">
							<!-- DataType property selectionable field -->
							<v-select
								v-model="dataType"
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
								:label="$t('metricsConfiguration.hasMax')"
							>
							</v-switch>							
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12" v-if="hasMax">
							<!-- Max property input field, only visible when hasMax property is true -->
							<v-text-field		
								v-model="max"
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
				<!-- Button to save the metric, disabled when at least one CreateMetric form field is invalid -->		
				<v-btn
					class="mb-4 ms-4"
					color="success"
					:disabled="!newValidMetric"
					@click="saveMetric()"
				>
					{{ $t('buttons.save') }}
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
	name: 'CreateMetric',

	data (){
		return {
			/*Component properties*/
			name: '',
			alias: '',
			description: '',
			max: 0,
			min: 0,
			dataType: null,
			interval: null,
			newValidMetric: false,
			hasMax: false,
			/*Arrays & rules*/
			dataTypeOptions: [
				'Decimal',
				'Entero'
			],
			nameRequiredRules: [
				v => !!v || 'El campo es requerido',
				v => v && v.length < 51 || this.$t('rules.maxLength50'),
				v => v && v.length > 4 || this.$t('rules.minLength5')
			],
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
			selectRules: [
        v => v && v != null || this.$t('rules.selectRule')
			]			
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Reset the create metric form.
		*/		
		resetForm(){
			this.$refs.configurationForm.reset();
		},

		/*
		@fvillarrealcespedes:
		Sends a request to create a new metric. Uses directly four inputable and selectable component properties, name, alias, description and max to 
		creates the new metric data object, also using some of these properties defines two others, min and interval.
		*/
		async saveMetric(){
			await axios
			.post(this.NEURONE_AD_API_URL + '/metric', {
				name: this.name,
				alias: this.alias,
				description: this.description,
				max: this.max,
				min: this.min,
				interval: this.interval
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
    ...mapState(['NEURONE_AD_API_URL'])
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