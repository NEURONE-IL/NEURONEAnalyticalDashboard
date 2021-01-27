<template>
	<v-container>
		<!-- Create ClassroomConfiguration dialog -->
		<v-dialog
			v-model="createDialog"
			max-width="75%"
			width="75%"
			persistent
		>
			<v-card>
				<!-- CreateClassroomConfiguration component -->
				<CreateClassroomConfiguration ref="createConfiguration"/>
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
		<!-- Update ClassroomConfiguration dialog -->
		<v-dialog
			v-model="updateDialog"
			max-width="75%"
			width="75%"
			persistent
		>
			<v-card>
				<!-- UpdateClassroomConfiguration component -->
				<UpdateClassroomConfiguration ref="updateConfiguration"/>
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
				<h2>{{ $t('classroomConfigurations.header') }}</h2>
				<v-divider></v-divider>	
				<br>	
				<v-card>
					<v-card-title>
						<!-- Button to show the create dialog -->
						<v-btn
							color="primary"
							@click="createDialog = true"
						>
							{{ $t('classroomConfigurations.createHeader') }}
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
						<!-- Display all custom classroomConfigurations -->
						<v-data-table
							:headers="headers"
							:items="classroomConfigurations"
							:search="search"
						>
							<template v-slot:[`item.action`]="{ item }">	
								<!-- Button to show the selected classroomConfiguration in the UpdateClassroomConfiguration component -->
								<v-btn
									icon
									color="blue"
									@click="viewConfiguration(item._id)"
								>
									<v-icon>
										mdi-pencil
									</v-icon> 
								</v-btn>
								<!-- Button to delete the selected classroomConfiguration after confirmation -->
								<v-btn
									icon
									color="red"
									@click="confirmDelete() && deleteClassroomConfiguration(item._id)"
								>
									<v-icon>
										mdi-delete
									</v-icon>
								</v-btn>    
							</template> 							  																		
						</v-data-table>					
				</v-card>
				<!-- Alert about custom classroomConfigurations -->
				<v-alert
					type="info"
					dense
					class="mt-4"
				>
					{{ $t('classroomConfigurations.alert') }}
				</v-alert>					
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import CreateClassroomConfiguration from '../ClassroomConfigurations/CreateClassroomConfiguration';
import UpdateClassroomConfiguration from '../ClassroomConfigurations/UpdateClassroomConfiguration';
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
	name: 'ClassroomConfigurations',

	components: {
		CreateClassroomConfiguration,
		UpdateClassroomConfiguration
	},

	data (){
		return {
			/*Dialogs properties*/
			createDialog: false,
			updateDialog: false,
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('classroomConfigurations.tableHeaders.name'), value: 'name', align: 'start'},
				{ text: this.$t('classroomConfigurations.tableHeaders.createdBy'), value:'createdBy' },
				{ text: this.$t('classroomConfigurations.tableHeaders.lastEditedBy'), value:'lastEditedBy' },
				{ text: this.$t('classroomConfigurations.tableHeaders.participants'), value: 'participants', align: 'center' },
				{ text: this.$t('classroomConfigurations.tableHeaders.actions'), value: 'action', sortable: false }
			],
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Methods imported from store.
		*/
		...mapActions([
			'getClassroomConfigurations'
		]),

		/*
		@fvillarrealcespedes:
		Sets a confirmation message previous the classroomConfiguration deletion. 
		*/		
    confirmDelete(){
      return confirm(this.$t('classroomConfigurations.deleteConfigurationConfirmation'))
		},

		/*
		@fvillarrealcespedes:
		Sends a request to delete a specific classroom configuration by its _id property, then gets the updated custom classroomConfigurations array.
		*/
		async deleteClassroomConfiguration(payload){
			await axios
			.delete(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/classroom-configuration/' + payload)
			.then(response => {
				this.getClassroomConfigurations();
				this.dispatchNotification('classroomConfigurations.deleteSuccess', 'check-circle', 5000, 'success');
			})	
      .catch(error => {
				console.log(error.response);
				this.dispatchNotification('classroomConfigurations.deleteError', 'close-circle', 5000, 'error');
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
		Hides the create dialog, calls getter method for classroomConfigurations, resets all CreateClassroomConfiguration component 
		fields and disposes its chart. 
		*/		
		resetCreate(){
			this.createDialog = false;
			this.$refs.createConfiguration.$refs.newConfigurationForm.reset();
			this.$refs.createConfiguration.disposeChart();
			this.$refs.createConfiguration.chart = null;
			this.$refs.createConfiguration.height = 0;
		},

		/*
		@fvillarrealcespedes:
		Hides the update dialog and disposes the update classroomConfiguration chart. 
		*/		
		resetUpdate(){
			this.updateDialog = false;
			this.$refs.updateConfiguration.disposeChart();
			this.$refs.updateConfiguration.chart = null;
			this.$refs.updateConfiguration.height = 0;
		},		

		/*
		@fvillarrealcespedes:
		Sets the selected classroomConfiguration in the UpdateClassroomConfiguration component by getting its _id property, then shows it in the update 
		dialog.
		*/		
		viewConfiguration(payload){
			this.classroomConfigurationId = payload;
			this.updateDialog = true;
		}
	},

	computed:{
		/*
		@fvillarrealcespedes:
		ClassroomConfigurationId for UpdateClassroomConfiguration component, get and set methods are imported from store.
		*/		
    classroomConfigurationId: {
      get () {
        return this.$store.getters.getClassroomConfigurationId;
			},			
      set (payload) {
        this.$store.commit('setClassroomConfigurationId', payload);
      }
		},
				
		/*
		@fvillarrealcespedes:
		Array that includes all custom classroomConfigurations, get and set methods are imported from store.
		*/				
    classroomConfigurations: {
      get () {
        return this.$store.getters.getClassroomConfigurations;
			},			
      set (payload) {
        this.$store.commit('setClassroomConfigurations', payload);
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