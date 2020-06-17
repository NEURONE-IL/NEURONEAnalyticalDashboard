<template>
	<v-container>
    <v-row no-gutters class="mt-4">
      <v-col sm="12" class="text-center">
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

					<v-select
						class="mt-4"
						:items= setValueOptions()
						v-model="rows"
						v-if="this.classroomConfiguration === 2"
						label="Cantidad de filas"
						prepend-icon="mdi-view-sequential"
						required
						:rules="selectRules"						
					></v-select>

					<v-select
						class="mt-4"
						:items= setValueOptions()
						v-model="columns"
						v-if="this.classroomConfiguration === 3"
						label="Cantidad de columnas"
						prepend-icon="mdi-view-column"
						required
						:rules="selectRules"						
					></v-select>										
				</v-form>		

				<v-btn
					class="mb-4"
					color="success"
					:disabled="!validConfiguration || this.participants.length === 0"
					@click="setClassroom(classroomConfiguration)"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>		

				<v-btn
					class="mb-4"
					color="error"
					:disabled="!validConfiguration || this.participants.length === 0"
					@click="print()"
				>
					Print	
					<v-icon right>
						mdi-print
					</v-icon>
				</v-btn>					

				<!--Gráfico-->
				<div class="classrooms" ref="chartdiv"></div>

      </v-col>
<!--			<v-col sm="4" class="text-center">
				<Metrics :colsSize=6 @updateFunction="updateSelectedMetrics"/>
			</v-col>	-->
			<v-col sm="4" class="text-center">
<!--				<Lateral :participants="selectedParticipants"/>	-->
			</v-col>			
		</v-row>
	</v-container>
</template>

<script>
import Lateral from '../components/Lateral';
import Metrics from '../components/Metrics';
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
/*Bibliotecas del gráfico*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

export default {
	name: 'Classroom',

	components: {
		Lateral,
		Metrics
	},	

	data (){
		return {
			/*View properties*/
			chart: null,
			classroomConfiguration: '',
			columns: '',
			rows: '',
			selectedParticipants: [],
			users: 0,
			validConfiguration: true,
			/*Node properties*/
			fontsize: '',
			maxRadius: '',
			separation: '',
			userIcoPath: 'M55,27.5C55,12.337,42.663,0,27.5,0S0,12.337,0,27.5c0,8.009,3.444,15.228,8.926,20.258l-0.026,0.023l0.892,0.752c0.058,0.049,0.121,0.089,0.179,0.137c0.474,0.393,0.965,0.766,1.465,1.127c0.162,0.117,0.324,0.234,0.489,0.348	c0.534,0.368,1.082,0.717,1.642,1.048c0.122,0.072,0.245,0.142,0.368,0.212c0.613,0.349,1.239,0.678,1.88,0.98	c0.047,0.022,0.095,0.042,0.142,0.064c2.089,0.971,4.319,1.684,6.651,2.105c0.061,0.011,0.122,0.022,0.184,0.033	c0.724,0.125,1.456,0.225,2.197,0.292c0.09,0.008,0.18,0.013,0.271,0.021C25.998,54.961,26.744,55,27.5,55	c0.749,0,1.488-0.039,2.222-0.098c0.093-0.008,0.186-0.013,0.279-0.021c0.735-0.067,1.461-0.164,2.178-0.287	c0.062-0.011,0.125-0.022,0.187-0.034c2.297-0.412,4.495-1.109,6.557-2.055c0.076-0.035,0.153-0.068,0.229-0.104	c0.617-0.29,1.22-0.603,1.811-0.936c0.147-0.083,0.293-0.167,0.439-0.253c0.538-0.317,1.067-0.648,1.581-1	c0.185-0.126,0.366-0.259,0.549-0.391c0.439-0.316,0.87-0.642,1.289-0.983c0.093-0.075,0.193-0.14,0.284-0.217l0.915-0.764	l-0.027-0.023C51.523,42.802,55,35.55,55,27.5z M2,27.5C2,13.439,13.439,2,27.5,2S53,13.439,53,27.5	c0,7.577-3.325,14.389-8.589,19.063c-0.294-0.203-0.59-0.385-0.893-0.537l-8.467-4.233c-0.76-0.38-1.232-1.144-1.232-1.993v-2.957	c0.196-0.242,0.403-0.516,0.617-0.817c1.096-1.548,1.975-3.27,2.616-5.123c1.267-0.602,2.085-1.864,2.085-3.289v-3.545	c0-0.867-0.318-1.708-0.887-2.369v-4.667c0.052-0.52,0.236-3.448-1.883-5.864C34.524,9.065,31.541,8,27.5,8	s-7.024,1.065-8.867,3.168c-2.119,2.416-1.935,5.346-1.883,5.864v4.667c-0.568,0.661-0.887,1.502-0.887,2.369v3.545	c0,1.101,0.494,2.128,1.34,2.821c0.81,3.173,2.477,5.575,3.093,6.389v2.894c0,0.816-0.445,1.566-1.162,1.958l-7.907,4.313	c-0.252,0.137-0.502,0.297-0.752,0.476C5.276,41.792,2,35.022,2,27.5z',
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
			/*Original properties*/
			eventSource: null,
			limit: 0,
			metrics: [],
			option: '',
			participants: [],
			principal: ''
		}
	},

	created(){
		let configuration = this.$store.getters.getConfiguration;
		this.metrics = configuration.metrics || [];
		this.principal = configuration.principal;
		this.limit = configuration.limit;
		this.option = configuration.option;
		this.eventSource = new EventSource(`${process.env.VUE_APP_API_URL}/init`);
		this.getInitTime();
		this.metrics.map(metric => {
			this.eventSource.addEventListener(metric, e => {
				this.updateMetrics(JSON.parse(e.data), metric);
			});
		});
	},

	mounted(){
		this.fontsize = 10;
		this.maxRadius = 15;
		this.separation = 50;
	},

	methods: {
		updateSelectedMetrics(checkedMetrics){
			this.metrics = [...checkedMetrics]
		},

		setClassroom(index){
			this.users = this.participants.length;		
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
					this.setCircleClassroom(data);
					break;
			}
			this.disposeChart();
			this.setChart(data, index);
		},

		setCircleClassroom(data){
			for(var i = 0; i < this.users; i++){
				var value1 = this.participants[i].results[this.principal];
				var color = this.setColor(value1);
				data.push(
					{
						id: i,
						name: this.participants[i].username,
						principal: this.principal + ': ' + value1,
						path: this.userIcoPath,
						color: color,
						fixed: true, 
						value: 1
					}
				);
			}
		},

		setClassroomPerRows(data){
			var nodesPer = Math.ceil(this.users/this.rows);
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);					
				var x = this.separation + (((i)%nodesPer)*this.separation*0.75);
				var y = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.1;
				data.push(
					{
						id: i,
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: this.userIcoPath,
						color: color,
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
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);			
				var x = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.1;
				var y = this.separation + (((i)%nodesPer)*this.separation*0.75);
				data.push(
					{
						id: i,
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: this.userIcoPath,
						color: color,
						fixed: true, 
						value: 1,
						x: x,
						y: y
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
						this.height = this.users*16;
					}
					break;
				/*Per Rows */
				case 2:
					this.height = this.rows*65;
					break;
				/*Per Columns*/
				case 3:
					this.height = Math.round(this.users/this.columns)*65;	
					break;
				/*Custom*/
				case 4:
					if(this.users <= 13){
						this.height = 200;
					}
					else{
						this.height = this.users*16;
					}					
					break;
			}
		},

		setChart(data, index){
			this.chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			this.setHeight(index);
			this.chart.svgContainer.htmlElement.style.height = this.height + "px";
			this.chart.background.fill = "#2196F3";
			this.chart.background.opacity = 0.1;
			this.chart.logo.height = -15000;

			var networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
			networkSeries.data = data;			
			
			networkSeries.dataFields.fixed = "fixed";
			networkSeries.dataFields.name = "name";
			networkSeries.dataFields.value = "value";
			networkSeries.dataFields.color = "color";
			networkSeries.fontSize = this.fontsize;
			networkSeries.maxRadius = this.maxRadius;
			networkSeries.nodes.template.fillOpacity = 1;
			
			networkSeries.nodes.template.label.text = "{id}"
			networkSeries.nodes.template.label.fill = "#000000";
			//networkSeries.nodes.template.label.dx = 15;
			//networkSeries.nodes.template.label.dy = 20;

			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";
			networkSeries.nodes.template.tooltipText = "{name} \n {principal} \n color: {color}";
			/*Uncomment to fill completly the node*/
			networkSeries.nodes.template.circle.disabled = true;
			networkSeries.nodes.template.outerCircle.disabled = true;			

			/*Icon*/ 
			let icon = networkSeries.nodes.template.createChild(am4core.Sprite);
			icon.propertyFields.path = "path";
			icon.horizontalCenter = "middle";
			icon.verticalCenter = "middle";
			icon.width = this.maxRadius;
			icon.height = this.maxRadius;
			icon.scale = 0.5;
			
			/*Events*/
			networkSeries.events.on("inited", function() {
				networkSeries.animate({
					property: "velocityDecay",
					to: 1
				}, 3000);
			});

			/*Selection*/
			var selectedNodes = [];
			networkSeries.nodes.template.events.on("up", function (event) {
				var node = event.target;
				if (selectedNodes.indexOf(node) === -1) {
					node.outerCircle.disabled = false;
					selectedNodes.push(node);
				}
				else {
					node.outerCircle.disabled = true;
					selectedNodes.forEach(element => {
						var index = selectedNodes.indexOf(node);
						if(index > -1){
							selectedNodes.splice(index, 1);
						}
					});
				}
			}, this)
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

		setValueOptions(){
			var values = [];
			for(var i=2; i<=this.setMaxValue(); i++){
				var value = Math.ceil(this.users/i);
				if(values.indexOf(value) === -1){
					values.push(value);
				}
			}
			function compare ( a, b ){ return a - b; }
			return values.sort( compare );
		},

    updateMetrics(newMetrics, metric) {
      if (this.participants.length === 0) {
        this.participants = [...newMetrics];
      } else {
        newMetrics.map((metric, i) => {
          this.participants[i].results = Object.assign(
            {},
            this.participants[i].results,
            metric.results
          );
        });
			}
			if(this.chart){
				this.updateChart();
			}
		},

		updateChart(){
			/*Principal update*/
			for(var i=0; i<this.users; i++){
				this.chart.series.values[0].data[i].principal = this.principal + ': ' + this.participants[i].results[this.principal];
			}				
			/*Color update*/
			if(this.option != ""){
				var color;
				for(var i=0; i<this.users; i++){
					color = this.setColor(this.participants[i].results[this.principal]);
					this.chart.series.values[0].dataItems.values[i].color = color; 
					this.chart.series.values[0].dataItems.values[i].node.fill = color;
					this.chart.series.values[0].dataItems.values[i].node.stroke = color;
					this.chart.series.values[0].dataItems.values[i].node.outerCircle.stroke = color;							
				}
				console.log('updated');
			}
		},

		print(){
			console.log(this.chart);
		},

		async getInitTime(){
			await axios
				.get(`${process.env.VUE_APP_API_URL}/inittime`)
				.then(response => {
					this.$store.commit("setInitTime", {
						initTime: response.data.initTime
					});
				})
				.catch(error => {
					console.log(error);
				})
		},

		setColor(value){
			switch(this.option){
				case "1":
					if(value > Number(this.limit)){
						return '#F44336';
					}
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					else{
						return '#4CAF50';
					}	
					break;				
				case "2":
					if(value < Number(this.limit)){
						return '#F44336';
					}
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					else{
						return '#4CAF50';
					}	
					break;				
				default:
					return '#2196F3';
					break;
			}
		}
	},		
/*
	watch: {
		users: function(){
			if(this.users <= 20){
				this.separation = 100;
			}
			else{
				this.separation = 45;			
			}
		},

		classroomConfiguration: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && (this.classroomConfiguration === 1 || this.classroomConfiguration === 4)){
				this.setChart([], this.classroomConfiguration);
			}
		},

		rows: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && this.rows !== ''){
				this.setChart([], this.classroomConfiguration);
			}
		},

		columns: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && this.columns !== ''){
				this.setChart([], this.classroomConfiguration);
			}
		}	
	}*/
}
</script>

<style>
.classrooms {
  width: 100%;
}
</style>