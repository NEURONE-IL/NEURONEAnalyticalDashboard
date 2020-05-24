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
					:disabled="!validConfiguration || this.participants.length === 0"
					@click="setClassroom(classroomConfiguration)"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>		

				<div class="classrooms" ref="chartdiv"></div>

      </v-col>
		</v-row>
	</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
/*Bibliotecas del gráfico*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

export default {
	name: 'ClassroomOld',

	data (){
		return {
			/*View properties*/
			chart: null,
			classroomConfiguration: '',
			columns: '',
			rows: '',
			selected: null,
			users: 0,
			validConfiguration: true,
			/*Node properties*/
			separation: '',
			fontsize: '',
			maxRadius: '',
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
		this.users = 45;
		//this.setHeight(1);
		//this.setClassroom(1);
	},

	methods: {
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
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);
				data.push(
					{
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z",
						color: color,
						fixed: true, 
						value: 1
					}
				);
			}
		},

		setClassroomPerRows(data){
			var value = this.participants[i].results[this.principal];
			var color = this.setColor(value);			
			var nodesPer = Math.ceil(this.users/this.rows);
			for(var i = 0; i < this.users; i++){
				var x = this.separation + (((i)%nodesPer)*this.separation*0.75);
				var y = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.1;
				data.push(
					{
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z",
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
			var value = this.participants[i].results[this.principal];
			var color = this.setColor(value);			
			var nodesPer = Math.ceil(this.users/this.columns);
			for(var i = 0; i < this.users; i++){
				var x = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.1;
				var y = this.separation + (((i)%nodesPer)*this.separation*0.75);
				data.push(
					{
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z",
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
						this.height = Math.round(this.users/this.columns)*55;
					}		
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
			//this.disposeChart();
			this.chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			this.setHeight(index);
			this.chart.svgContainer.htmlElement.style.height = this.height + "px";
			this.chart.background.fill = '#2196F3';
			this.chart.background.opacity = 0.1;
			//this.chart.logo.height = -15000;

			var networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
			networkSeries.data = data;			
			networkSeries.dataFields.name = "name";
			networkSeries.dataFields.value = "value";
			networkSeries.dataFields.fixed = "fixed";
			networkSeries.dataFields.fixed = "fixed";
			networkSeries.dataFields.color = "color";
			networkSeries.fontSize = this.fontsize;
			networkSeries.maxRadius = this.maxRadius;
			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";
			networkSeries.nodes.template.tooltipText = "{name} \n {principal}";
			networkSeries.nodes.template.fillOpacity = 1;
//			networkSeries.nodes.template.label.text = "{name}"
//			networkSeries.nodes.template.label.hideOversized = true;
//			networkSeries.nodes.template.label.truncate = true;
			networkSeries.nodes.template.circle.disabled = true;
			networkSeries.nodes.template.outerCircle.disabled = true;			

			/*Icon*/ 
/*			
			let icon = networkSeries.nodes.template.createChild(am4core.Sprite);
			icon.propertyFields.path = "path";
			icon.horizontalCenter = "middle";
			icon.verticalCenter = "middle";
			icon.width = this.maxRadius*2;
			icon.height = this.maxRadius*2;
*/
			/*Events*/
			networkSeries.events.on("inited", function() {
				networkSeries.animate({
					property: "velocityDecay",
					to: 1
				}, 3000);
			});

			/*Selection*/
			var selectedNode;
			var selectedNodes = [];

			networkSeries.nodes.template.events.on("up", function (event) {
				var node = event.target;
				if (selectedNodes.indexOf(node) === -1) {
					node.outerCircle.disabled = false;
					selectedNode = node;
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
			})
			//console.log(this.chart.series.values[0].data)
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

    updateMetrics(newMetrics, metric) {
      if (this.participants.length == 0) {
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
			this.setClassroom(this.classroomConfiguration);
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
			//red
			if(value > this.limit){
				return '#F44336';
			}
			//orange
			else if(value === this.limit){
				return '#FF9800';
			}
			//green
			else{
				return '#4CAF50';
			}
		}
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
		}	
	}
}
</script>

<style>
.classrooms {
  width: 100%;
}
</style>