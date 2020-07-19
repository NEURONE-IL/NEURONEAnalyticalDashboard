<template>
	<v-container>
		<!--Create Dialog-->
		<v-dialog
			v-model="createDialog"
			max-width="80%"
			persistent
		>
			<v-card>
				<CreateClassroomConfiguration ref="createConfiguration"/>
				<v-card-actions>
					<v-spacer></v-spacer>
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

		<!--Update Dialog-->
		<v-dialog
			v-model="updateDialog"
			max-width="80%"
			persistent
		>
			<v-card>
				<UpdateClassroomConfiguration :classroomConfigurationId="this.classroomConfigurationId" ref="updateConfiguration"/>
				<v-card-actions>
					<v-spacer></v-spacer>
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
					<v-data-table
						:headers="headers"
						:items="classroomConfigurations"
						:search="search"
					>
						<template v-slot:item.action="{ item }">		
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
import CreateClassroomConfiguration from '../ClassroomConfigurations/CreateClassroomConfiguration';
import UpdateClassroomConfiguration from '../ClassroomConfigurations/UpdateClassroomConfiguration';
import axios from 'axios';
import { mapState } from 'vuex';

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
			/*Dialog properties*/
			createDialog: false,
			updateDialog: false,
			classroomConfigurationId: '',
			/*Data table properties*/
			search: '',
			headers: [
				{
					text: 'Nombre',
					align: 'start',
					value: 'name',
				},
				{ text: 'Creada por', value:'createdBy' },
				{ text: 'Participantes', value: 'participants' },
				{ text: 'Acciones', value: 'action', sortable: false }
			],
		}
	},

	mounted(){
		this.getClassroomConfigurations();
	},

	methods: {
		resetCreate(){
			this.createDialog = false;
			this.getClassroomConfigurations();
			this.$refs.createConfiguration.$refs.newConfigurationForm.reset();
			this.$refs.createConfiguration.disposeChart();
		},

		resetUpdate(){
			//this.configurationId = null;
			this.updateDialog = false;
			this.$refs.updateConfiguration.$refs.editConfigurationForm.reset();
			this.$refs.updateConfiguration.disposeChart();
		},		

    confirmDelete(){
      return confirm('¿Está segur@ que desea borrar esta configuración de aula?')
		},
		
		viewConfiguration(payload){
			this.classroomConfigurationId = payload;
			this.updateDialog = true;
		},

    async getClassroomConfigurations(){
      await axios
      .get(this.NEURONE_AD_API_URL + '/classroom-configurations')
      //.get(`${process.env.NEURONE_AD_API_URL}/classroom-configurations`)
      .then(response => {
        this.classroomConfigurations = response.data;
      })
      .catch(e => {
        console.log(e.response);
      })
		},

		async deleteClassroomConfiguration(payload){
			await axios
			.delete(this.NEURONE_AD_API_URL + '/classroom-configuration/' + payload)
			.then(response => {
				console.log('Done');
				this.getClassroomConfigurations();
			})	
      .catch(e => {
        console.log(e)
      })
		}
	},

	computed:{
    ...mapState(['NEURONE_AD_API_URL'])
	},	
}
</script>

<style scoped>
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>