<template>
	<v-container>
    <v-row no-gutters class="mt-4">
      <v-col sm="8" class="text-center">
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<v-select
						v-model="classroomConfiguration"
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
						v-if="this.classroomConfiguration === 2"
						thumb-label="always"
						:thumb-size="16"              
						thumb-color="primary"
						label="Cantidad de filas"
						:min= Math.ceil(this.users/10)
						:max= setMaxValue()
						required
						:rules="requiredRules"
					></v-slider> 	

					<v-slider
						v-model="columns"
						v-if="this.classroomConfiguration === 3"
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
					class="mb-4"
					color="success"
					@click="setClassroom(classroomConfiguration)"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>	

				<v-btn
					class="mb-4"
					color="success"
					@click="up"
				>
					Up
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>						

				<div id="container" class="classroom" ref="chartdiv"></div>

      </v-col>
		</v-row>
	</v-container>
</template>


<script>

import { mapActions, mapState } from 'vuex';
import axios from 'axios';
/*Biblioteca del gráfico*/
import Anychart from 'anychart'

export default {
	name: 'Classroom',
	data (){
		return {
			/*View properties*/
			users: 0,
			classroomConfiguration: '',
			rows: '',
			columns: '',
			validConfiguration: true,
			chart: null,
			changes: 0,
			selected: null,
			/*Node properties*/
			separation: '',
			/*Array & Rules*/
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
			/*Component properties*/
			height: 0,
		}
	},

	mounted(){
		this.users = 10;
		this.separation = 40;
		this.fontsize = 8;
		this.maxRadius = 15;
		this.height = 200;	
		this.setClassroom(1);
	},

	methods: {

		setClassroom(index){
			var data = {
				nodes: [],
				edges: []
			};
			switch(index){
				case 1:
					this.setCircleClassroom(data.nodes);
					break;
				case 2:
					this.setClassroomPerRows(data.nodes);
					break;
				case 3:
					this.setClassroomPerColumns(data.nodes);
					break;
				case 4:
					this.setCustomClassroom(data.nodes);
					break;
			}
			this.disposeChart();
			this.setChart(data, index);
		},

		setCircleClassroom(data){
			for(var i = 0; i < this.users; i++){
				data.push(
					{
						id: 'PC ' + i,
					}
				);
			}
			//console.log(this.$refs.chartdiv)
		},

		setClassroomPerRows(data){
			var nodesPer = Math.ceil(this.users/this.rows);
			for(var i = 0; i < this.users; i++){
				var x = this.separation + (((i)%nodesPer)*this.separation*0.75);
				var y = this.separation + this.separation * Math.trunc(i/nodesPer)*1.1;
				data.push(
					{
						id: 'PC ' + i,
						x: x,
						y: y
					}
				);
			}
		},

		setClassroomPerColumns(data){
			var nodesPer = Math.ceil(this.users/this.columns);
			for(var i = 0; i < this.users; i++){
				var x = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.1;
				var y = this.separation + (((i)%nodesPer)*this.separation*0.75);
				data.push(
					{
						id: 'PC ' + i,
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
						id: 'PC ' + i,
					}
				);
			}
		},

		setHeight(index){
			switch(index){
				/*Circular*/
				case 1:
					if(this.users <= 13){
						this.height = 200;
					}
					else{
						this.height = 550;
					}
					break;
				/*Per Rows */
				case 2:
					if(this.rows <= 6){
						this.height = this.rows*60;
					}
					else{
						this.height = this.rows*55;
					}		
					break;
				/*Per Columns*/
				case 3:
					if(Math.round(this.users/this.columns) <= 6){
						this.height = Math.round(this.users/this.columns)*60;
					}
					else{
						this.height = Math.round(this.users/this.columns)*60;
					}		
					break;
				/*Custom*/
				case 4:
					if(this.users <= 13){
						this.height = 200;
					}
					else{
						this.height = 550;
					}					
					break;
			}
		},

		setChart(data, index){
			if(this.chart){
				this.selected = this.chart.nodes().selected();
			}
			this.disposeChart();
			this.setHeight(index);
			this.chart = anychart.graph(data);
			this.chart.nodes().normal().height(15);
			this.chart.nodes().hovered().height(30);
			// prevent zooming the chart with the mouse wheel
			this.chart.interactivity().zoomOnMouseWheel(false);
			// set the chart title
			this.chart.title("Sala de clases");
			this.chart.height(this.height);
			// set the container id
			this.chart.container("container");
			switch(index){
				/*Circular*/
				case 1:
					this.chart.layout().iterationCount(0);
					break;
				/*Per Rows */
				case 2:
					this.chart.layout().type("fixed");
					break;
				/*Per Columns*/
				case 3:
					this.chart.layout().type("fixed");
					break;
				/*Custom*/
				case 4:
					this.chart.layout().iterationCount(0);
					break;
			}
			// initiate drawing the chart
			/*
			this.chart.listen("click", function() {
				console.log('clicked');
			});	
			*/		
			this.chart.nodes().tooltip().useHtml(true);
			this.chart.nodes().tooltip().format(
				"<span style='font-weight:bold'>{%id}</span>"
			);
			this.chart.draw();

			var data = this.chart.data();
			var nodesData = data.nodes;
			var edgesData = data.edges;
			console.log(edgesData);

		},

		up(){
			var nodes = this.chart.nodes();
			nodes.hovered().height(70);
			nodes.hovered().fill("white");
		//	this.disposeChart();
		//	this.setClassroom(this.classroomConfiguration)
		},

		disposeChart(){
			if(this.chart){
				this.chart.dispose();
			}
		},

		resetForm(){
			this.$refs.configurationForm.reset();
		},

		setMaxValue(){
			if(this.users === 2){
				return 2;
			}
			else if(this.users < 10){
				return Math.ceil(this.users/2);
			}else{
				return Math.ceil(this.users/(Math.ceil(this.users/10)));
			}
		},

	},

	watch: {
		
		users: function(){
			if(this.users <= 20){
				this.separation = 100;
			}
			else{
				this.separation = 45;			
			}
		},

		configuration: function(){
			if(this.configuration !== '' && this.users > 1 && (this.configuration === 1 || this.configuration === 4)){
				this.setChart([], this.configuration);
			}
		},

		rows: function(){
			if(this.configuration !== '' && this.users > 1 && this.rows !== ''){
				this.setChart([], this.configuration);
			}
		},

		columns: function(){
			if(this.configuration !== '' && this.users > 1 && this.columns !== ''){
				this.setChart(this.configuration);
			}
		},
	}
}
</script>

<style>

.classroom {
  width: 100%;
  height: 550px;
  margin: 0;
  padding: 0;
}

.anychart-credits {
  display: none;
}

</style>