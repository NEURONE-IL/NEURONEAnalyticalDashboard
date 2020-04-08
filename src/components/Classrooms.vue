<template>
	<v-container>
    <v-row no-gutters class="mt-4">
      <v-col sm="6" class="text-center">
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<v-slider
						v-model="users"
						thumb-label="always"
						:thumb-size="16"              
						thumb-color="primary"
						label="Cantidad de usuarios"
						:min= 1
						:max= 20
						required
						:rules="requiredRules"
					></v-slider> 

					<v-select
						v-model="configuration"
						:items="items"
						item-value="id"
						item-text="name"
						label="Seleccionar visualización de aula"
						prepend-icon="mdi-format-list-bulleted"
						required
						:rules="selectRules"
					></v-select>	

					<v-slider
						class="mt-4"
						v-model="rows"
						v-if="this.configuration === 2"
						thumb-label="always"
						:thumb-size="16"              
						thumb-color="primary"
						label="Cantidad de filas"
						:min= Math.ceil(this.users/5)
						:max= setMaxValue()
						required
						:rules="requiredRules"
					></v-slider> 	

					<v-slider
						v-model="columns"
						v-if="this.configuration === 3"
						thumb-label="always"
						:thumb-size="16"              
						thumb-color="primary"
						label="Cantidad de columnas"
						:min= Math.ceil(this.users/5)
						:max= setMaxValue()
						required
						:rules="requiredRules"						
					></v-slider> 

				</v-form>		

				<v-btn
					color="success"
					:disabled="!validConfiguration"
					@click="setClassroom(configuration)"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>						

				<div class="classrooms" ref="chartdiv">
				</div>

      </v-col>
			<v-col sm="6">
				<div>

				</div>
			</v-col>
    </v-row>	
	</v-container>
</template>


<script>

import { mapActions, mapState } from 'vuex';
/*Bibliotecas del gráfico*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

am4core.useTheme(am4themes_animated);

export default {
	name: 'Classrooms',
	data (){
		return {
			users: 1,
			configuration: '',
			rows: '',
			columns: '',
			validConfiguration: true,
			items: [
				{ id: 1, name: 'Circular' },
				{ id: 2, name: 'En filas' },
				{ id: 3, name: 'En columnas' },
				{ id: 4, name: 'Personalizada' }
			],
			selectRules: [
        v => v && v != null || 'Debe seleccionar una opción',
			],
			requiredRules: [
        v => !!v || 'El campo es obligatorio',
			],
		}
	},

	methods: {
		setClassroom(index){
			var data = [];
			switch(index){
				case 1:
					this.setCircleClassroom(data);
					break;
				case 2:
					this.setClassroomPerRows(data);
					break;
				case 3:
					this.setClassroomPerColumns(data);
					break;
				case 4:
					this.setCustomClassroom(data);
					break;
			}
			this.disposeChart('chartdiv')
			this.setChart(data);
			this.resetForm();
		},

		setCircleClassroom(data){
			for(var i = 0; i < this.users; i++){
				data.push(
					{
						name: "PC " + (i+1), 
						fixed: true, 
						value: 1
					}
				);
			}
		},

		setClassroomPerRows(data){
			var nodesPer = Math.ceil(this.users/this.rows);
			for(var i = 0; i < this.users; i++){
				var x = 100 + (((i)%nodesPer)*100);
				var y = 100 + 100 * Math.trunc(i/nodesPer);
				data.push(
					{
						name: "PC " + (i+1), 
						fixed: true, 
						value: 1,
						x: x,
						y: y
					}
				);
			}
		},

		setClassroomPerColumns(data){
			var nodesPer = Math.ceil(this.users/this.columns);
			for(var i = 0; i < this.users; i++){
				var x = 100 + 100 * Math.trunc(i/nodesPer);
				var y = 100 + (((i)%nodesPer)*100);
				data.push(
					{
						name: "PC " + (i+1), 
						fixed: true, 
						value: 1,
						x: x,
						y: y
					}
				);
			}
		},

		setCustomClassroom(data){
			for(var i = 0; i < this.users; i++){
				data.push(
					{
						name: "PC " + (i+1), 
						value: 1
					}
				);
			}
		},

		setChart(data){
			/*Chart init*/
			var chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

			networkSeries.data = data;

			networkSeries.dataFields.name = "name";
			networkSeries.dataFields.id = "name";
			networkSeries.dataFields.value = "value";
			networkSeries.dataFields.fixed = "fixed";

			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";

			networkSeries.nodes.template.tooltipText = "{name}";
			networkSeries.nodes.template.fillOpacity = 1;

			networkSeries.nodes.template.label.text = "{name}"
			networkSeries.fontSize = 8;
			networkSeries.nodes.template.label.hideOversized = true;
			networkSeries.nodes.template.label.truncate = true;

			networkSeries.maxRadius = 30;
		},

		disposeChart(chartdiv){
			am4core.disposeAllCharts();
		},

		resetForm(){
			this.$refs.configurationForm.reset();
		},

		setMaxValue(){
			if(this.users === 2){
				return 2;
			}
			if(this.users < 10){
				return Math.ceil(this.users/2);
			}else{
				return 5;
			}
		}
	},


	watch: {
		/*
		configuration: function(){
			switch(this.configuration){
				case 0:
					this.setClassroom(this.configuration);
					break;
				case 3:
					this.setClassroom(this.configuration);
					break;
			}
		}
		*/
	}
}
</script>

<style>

.classrooms {
  width: 100%;
  height: 550px;
}

</style>