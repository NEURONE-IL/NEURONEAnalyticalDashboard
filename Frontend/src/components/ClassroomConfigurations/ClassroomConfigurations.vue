<template>
	<v-container>
		<!-- Create dialog -->
		<v-dialog
			v-model="createDialog"
			max-width="80%"
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
						Cerrar					
						<v-icon right>
							mdi-close
						</v-icon> 	
					</v-btn>					
				</v-card-actions>					
			</v-card>		
		</v-dialog>

		<!-- Update dialog -->
		<v-dialog
			v-model="updateDialog"
			max-width="80%"
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
						Cerrar					
						<v-icon right>
							mdi-close
						</v-icon> 	
					</v-btn>					
				</v-card-actions>					
			</v-card>		
		</v-dialog>

    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>Configuraciones de aula</h2>
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
							Crear nueva configuración
							<v-icon dark right>mdi-plus</v-icon>
						</v-btn>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<!-- Display all custom classroom configurations -->
					<v-data-table
						:headers="headers"
						:items="classroomConfigurations"
						:search="search"
					>
						<template v-slot:item.action="{ item }">		
							<!-- Button to show the selected classroom configuration in the UpdateClassroomConfiguration component -->
							<v-btn
								icon
								small
								@click="viewConfiguration(item._id)"
							>
								<v-icon
									small
								>
									mdi-pencil
								</v-icon> 
							</v-btn>
							<!-- Button to delete the selected classroom configuration after confirmation -->
							<v-btn
								icon
								small
								@click="confirmDelete() && deleteClassroomConfiguration(item._id)"
							>
								<v-icon
									small
								>
									mdi-delete
								</v-icon>
							</v-btn>    
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
import CreateClassroomConfiguration from '../ClassroomConfigurations/CreateClassroomConfiguration';
import UpdateClassroomConfiguration from '../ClassroomConfigurations/UpdateClassroomConfiguration';
import axios from 'axios';
import { mapState } from 'vuex';
import { create } from '@amcharts/amcharts4/core';

export default {
	name: 'ClassroomConfigurations',

	components: {
		CreateClassroomConfiguration,
		UpdateClassroomConfiguration
	},

	data (){
		return {
			/*Component properties*/
			classroomConfigurations: [],
			/*Dialogs properties*/
			createDialog: false,
			updateDialog: false,
			/*Data table properties*/
			search: '',
			headers: [
				{ text: 'Nombre', value: 'name', align: 'start'},
				{ text: 'Creada por', value:'createdBy' },
				{ text: 'Participantes', value: 'participants' },
				{ text: 'Acciones', value: 'action', sortable: false }
			],
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked when the DOM is mounted and allows to access the reactive component. Calls the getter method for classroom configurations. 
	*/
	mounted(){
		this.getClassroomConfigurations();
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Hides the create dialog, calls the getter method for classroom configurations, resets all the CreateClassroomConfiguration component 
		fields and finally disposes the chart of the same component. 
		*/		
		resetCreate(){
			this.createDialog = false;
			this.getClassroomConfigurations();
			this.$refs.createConfiguration.$refs.newConfigurationForm.reset();
			this.$refs.createConfiguration.disposeChart();
		},

		/*
		@fvillarrealcespedes:
		Hides the update dialog and disposes the update classroom configuration chart. 
		*/		
		resetUpdate(){
			this.updateDialog = false;
			this.$refs.updateConfiguration.disposeChart();
		},		

		/*
		@fvillarrealcespedes:
		Sets a confirmation message previous the classroom configuration deletion. 
		*/		
    confirmDelete(){
      return confirm('¿Está segur@ que desea borrar esta configuración de aula?')
		},
		
		/*
		@fvillarrealcespedes:
		Sets the selected classroom configuration in the UpdateClassroomConfiguration component by getting its _id property, then shows the update 
		dialog.
		*/		
		viewConfiguration(payload){
			this.classroomConfigurationId = payload;
			this.updateDialog = true;
		},

		/*
		@fvillarrealcespedes:
		Sends a request to get all classrooms configurations, then sets classroomConfigurations property as the response data. 
		*/
    async getClassroomConfigurations(){
      await axios
      .get(this.NEURONE_AD_API_URL + '/classroom-configurations')
      .then(response => {
        this.classroomConfigurations = response.data;
      })
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Sends a request to delete a specific classroom configuration by its _id property, then gets the updated array of custom classroom 
		configurations.
		*/
		async deleteClassroomConfiguration(payload){
			await axios
			.delete(this.NEURONE_AD_API_URL + '/classroom-configuration/' + payload)
			.then(response => {
				this.getClassroomConfigurations();
			})	
      .catch(error => {
        console.log(error.response);
      })
		}
	},

	computed:{
		/*
		@fvillarrealcespedes:
		NEURONE-AD backend URL. 
		*/			
		...mapState(['NEURONE_AD_API_URL']),
		
		/*
		@fvillarrealcespedes:
		ClassroomConfigurationId for the UpdateClassroomConfiguration component, get and set methods are imported from the store.
		*/		
    classroomConfigurationId: {
      get () {
        return this.$store.getters.getClassroomConfigurationId;
			},			
      set (payload) {
        this.$store.commit('setClassroomConfigurationId', payload);
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