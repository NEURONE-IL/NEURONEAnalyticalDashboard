<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>Observatorio de participantes</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- Clock component only visible when showClock property is true -->
				<Clock v-if="showClock"/>
				<!-- Form to set the classroom configuration for the nodes chart -->
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
				>
					<!-- Select for the classroom configuration to display the nodes -->
					<v-select
						v-model="classroomConfiguration"
						:items="classroomConfigurations"
						item-value="id"
						item-text="name"
						label="Seleccionar visualización de aula"
						prepend-icon="mdi-format-list-bulleted"
						required
						:rules="selectRules"
					>
					</v-select>	
					<!-- Select for the rows number in case the classroom configuration by rows is selected -->
					<v-select
						class="mt-4"
						:items="setValueOptions()"
						v-model="rows"
						v-if="this.classroomConfiguration === 2"
						label="Cantidad de filas"
						prepend-icon="mdi-view-sequential"
						required
						:rules="selectRules"						
					>
					</v-select>
					<!-- Select for the columns number in case the classroom configuration by columns is selected -->
					<v-select
						class="mt-4"
						:items="setValueOptions()"
						v-model="columns"
						v-if="this.classroomConfiguration === 3"
						label="Cantidad de columnas"
						prepend-icon="mdi-view-column"
						required
						:rules="selectRules"						
					>
					</v-select>										
				</v-form>	
				<!-- Button to set the nodes chart, disabled if no classroom configuration is selected or the users number is zero -->
				<v-btn
					class="mb-4 ms-4"
					color="success"
					:disabled="!validConfiguration || this.users === 0"
					@click="setClassroom(classroomConfiguration)"
				>
					Aceptar	
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>		
				<!-- Button to end the current session -->
				<v-btn
					class="mb-4 ms-4"
					color="error"
					@click="endSession()"
				>
					Finalizar sesión	
					<v-icon right>
						mdi-timer-off
					</v-icon>
				</v-btn>	
				<!-- Nodes chart -->
				<div class="classroom" ref="chartdiv"></div>
				<!-- Line chart dialog -->
				<v-dialog
					v-model="showLineChart"
					max-width="80%"
					persistent				
				>
					<v-card>
						<LineChart ref="lineChart"/>
						<v-card-actions>
							<v-spacer></v-spacer>
							<!-- Button to close the line chart dialog-->
							<v-btn
								color="error"
								@click="resetLineChart()"
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
      </v-col>		
		</v-row>
	</v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import LineChart from '../Classroom/LineChart';
import Clock from '../Classroom/Clock';
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
/*
@fvillarrealcespedes:
Chart library imports.
*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

am4core.useTheme(am4themes_animated);

export default {
	name: 'Classroom',

	components: {
		LineChart,
		Clock
	},

	data (){
		return {
			/*Component properties*/
			chart: null,
			classroomConfiguration: '',
			columns: '',
			rows: '',
			users: 0,
			validConfiguration: true,
			/*Chart properties*/
			height: 800,			
			/*Specific nodes properties*/
			fontsize: '',
			maxRadius: '',
			separation: '',
			userIcoPath: 'M55,27.5C55,12.337,42.663,0,27.5,0S0,12.337,0,27.5c0,8.009,3.444,15.228,8.926,20.258l-0.026,0.023l0.892,0.752c0.058,0.049,0.121,0.089,0.179,0.137c0.474,0.393,0.965,0.766,1.465,1.127c0.162,0.117,0.324,0.234,0.489,0.348	c0.534,0.368,1.082,0.717,1.642,1.048c0.122,0.072,0.245,0.142,0.368,0.212c0.613,0.349,1.239,0.678,1.88,0.98	c0.047,0.022,0.095,0.042,0.142,0.064c2.089,0.971,4.319,1.684,6.651,2.105c0.061,0.011,0.122,0.022,0.184,0.033	c0.724,0.125,1.456,0.225,2.197,0.292c0.09,0.008,0.18,0.013,0.271,0.021C25.998,54.961,26.744,55,27.5,55	c0.749,0,1.488-0.039,2.222-0.098c0.093-0.008,0.186-0.013,0.279-0.021c0.735-0.067,1.461-0.164,2.178-0.287	c0.062-0.011,0.125-0.022,0.187-0.034c2.297-0.412,4.495-1.109,6.557-2.055c0.076-0.035,0.153-0.068,0.229-0.104	c0.617-0.29,1.22-0.603,1.811-0.936c0.147-0.083,0.293-0.167,0.439-0.253c0.538-0.317,1.067-0.648,1.581-1	c0.185-0.126,0.366-0.259,0.549-0.391c0.439-0.316,0.87-0.642,1.289-0.983c0.093-0.075,0.193-0.14,0.284-0.217l0.915-0.764	l-0.027-0.023C51.523,42.802,55,35.55,55,27.5z M2,27.5C2,13.439,13.439,2,27.5,2S53,13.439,53,27.5	c0,7.577-3.325,14.389-8.589,19.063c-0.294-0.203-0.59-0.385-0.893-0.537l-8.467-4.233c-0.76-0.38-1.232-1.144-1.232-1.993v-2.957	c0.196-0.242,0.403-0.516,0.617-0.817c1.096-1.548,1.975-3.27,2.616-5.123c1.267-0.602,2.085-1.864,2.085-3.289v-3.545	c0-0.867-0.318-1.708-0.887-2.369v-4.667c0.052-0.52,0.236-3.448-1.883-5.864C34.524,9.065,31.541,8,27.5,8	s-7.024,1.065-8.867,3.168c-2.119,2.416-1.935,5.346-1.883,5.864v4.667c-0.568,0.661-0.887,1.502-0.887,2.369v3.545	c0,1.101,0.494,2.128,1.34,2.821c0.81,3.173,2.477,5.575,3.093,6.389v2.894c0,0.816-0.445,1.566-1.162,1.958l-7.907,4.313	c-0.252,0.137-0.502,0.297-0.752,0.476C5.276,41.792,2,35.022,2,27.5z',
			/*Arrays & rules*/
			classroomConfigurations: [
				{ id: 1, name: 'Circular' },
				{ id: 2, name: 'En filas' },
				{ id: 3, name: 'En columnas' },
			],
			valueOptions: [],
			selectRules: [
        v => v && v != null || 'Debe seleccionar una opción',
			],
			requiredRules: [
        v => !!v || 'El campo es requerido',
			],
			/*Original NEURONE-AM properties*/
			eventSource: null,
			limit: 0,
			metrics: [],
			option: '',
			participants: [],
			principal: '',
			/*Clock component show condition*/
			showClock: false
		}
	},

	/*
	@fvillarrealcespedes:
	NEURONE-AM original function, invoked before the rendering.
	Gets the configuration from the store, sets the EventSource to receive the metrics, gets the session init time, the classroom 
	configurations and finally enables and disables tabs from the left drawer.
	*/
	created(){
		let configuration = this.$store.getters.getConfiguration;
		this.metrics = configuration.metrics || [];
		this.principal = configuration.principal;
		this.limit = configuration.limit;
		this.option = configuration.option;
		this.eventSource = new EventSource(`${process.env.VUE_APP_API_URL}/init`);
		this.waitInitTime();
		this.metrics.map(metric => {
			this.eventSource.addEventListener(metric, e => {
				this.updateMetrics(JSON.parse(e.data), metric);
			});
		});
		this.getClassroomConfigurations();
		this.tabs[1].disabled = false;
		this.tabs[0].disabled = true;
	},

	/*
	@fvillarrealcespedes:
	Invoked after create, initializes some component properties, mainly the associated to the nodes chart.
	*/
	mounted(){
		this.fontsize = 10;
		this.maxRadius = 15;
		this.separation = 50;
		this.selectedParticipants = [];
		this.allParticipants = [];
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Hides the line chart component and disposes the chart itself.
		*/
		resetLineChart(){
			this.showLineChart = false;
			this.$refs.lineChart.disposeChart();
			this.lineChartUsername = null;	
			this.lineChartSelectedMetric = null;
		},

		/*
		@fvillarrealcespedes:
		Sets the data for the nodes chart depending on the index param with a switch-case, case 1 for circle configuration, 2 for rows 
		configurations, 3 for columns configuration and a default case for custom configurations.
		*/
		setClassroom(index){
			this.selectedParticipants = [];		
			this.allParticipants = [];	
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
			}
			this.disposeChart();
			this.setChart(data, index);
		},

		/*
		@fvillarrealcespedes:
		Sets the nodes of the nodes chart in circle. Uses the principal metric value to set a color for the node in case the alert option 
		is enabled, then creates the data object for the node and pushes it to the data array.
		*/
		setCircleClassroom(data){
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);
				data.push(
					{
						id: i,
						name: this.participants[i].username,
						principal: this.principal + ': ' + value,
						path: this.userIcoPath,
						color: color,
						fixed: true, 
						value: 1
					}
				);
			}
		},

		/*
		@fvillarrealcespedes:
		Sets the nodes of the nodes chart in rows. Calculates the numbers of nodes per row and an offset to align the nodes to the chart 
		center. Uses the principal metric value to set a color for the node in case the alert option is enabled, then creates the data 
		object for the node and pushes it to the data array.
		*/
		setClassroomPerRows(data){
			var nodesPerRow = Math.ceil(this.users/this.rows);
			var offset = this.setOffset(nodesPerRow);
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);					
				var x = this.separation + (((i)%nodesPerRow)*this.separation*0.75) + offset;
				var y = this.separation + this.separation * Math.trunc(i/nodesPerRow) * 1.2;
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

		/*
		@fvillarrealcespedes:
		Sets the nodes of the nodes chart in columns. Calculates the numbers of nodes per column and an offset to align the nodes to the 
		chart center. Uses the principal metric value to set a color for the node in case the alert option is enabled, then creates the 
		data object for the node and pushes it to the data array.
		*/
		setClassroomPerColumns(data){		
			var nodesPer = Math.ceil(this.users/this.columns);
			var offset = this.setOffset(nodesPer);
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);			
				var x = this.separation + this.separation * Math.trunc(i/nodesPer) * 1.2 + offset;
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

		/*
		@fvillarrealcespedes:
		Sets an offset to align the nodes to nodes chart center in case that the classroom configuration selected is per rows, per columns 
		or custom.
		*/
		setOffset(nodesPer){
			return (this.$refs.chartdiv.clientWidth - nodesPer*this.separation)/2;
		},

		/*
		@fvillarrealcespedes:
		Sets the height for the nodes chart depending of the users quantity, the height is calcuted differently for each configuration.
		*/
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
				/*Per Rows*/
				case 2:
					this.height = this.rows*65;
					break;
				/*Per Columns*/
				case 3:
					this.height = Math.round(this.users*68/this.columns);	
					break;
			}
		},

		/*
		@fvillarrealcespedes:
		Sets all nodes chart properties, from the height, to the nodes and the available events.
		*/
		setChart(data, index){
			/*Chart creation*/
			this.chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			/*Sets the chart container height*/
			this.setHeight(index);
			this.chart.svgContainer.htmlElement.style.height = this.height + "px";
			/*Background properties*/
			this.chart.background.fill = "#2196F3";
			this.chart.background.opacity = 0.1;
			this.chart.logo.height = -15000;
			/*Creates the data series for the chart*/
			var networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
			/*Sets the series data and datafields*/
			networkSeries.data = data;
			networkSeries.dataFields.fixed = "fixed";
			networkSeries.dataFields.id = "id";
			networkSeries.dataFields.name = "name";
			networkSeries.dataFields.value = "value";
			networkSeries.dataFields.color = "color";
			/*Sets the font size and node maximum radius*/
			networkSeries.fontSize = this.fontsize;
			networkSeries.maxRadius = this.maxRadius;
			/*Sets the node properties as the label and the maximum and minimum values for x and y coordinates in the chart*/
			networkSeries.nodes.template.fillOpacity = 1;
			networkSeries.nodes.template.label.text = "{id}"
			networkSeries.nodes.template.label.fill = "#000000";
			networkSeries.nodes.template.maxX = this.$refs.chartdiv.clientWidth;
			networkSeries.nodes.template.maxY = this.$refs.chartdiv.clientHeight;
			networkSeries.nodes.template.minX = 0;
			networkSeries.nodes.template.minY = 0;			
			/*Sets the node properties as x and y to set the position in the chart and the tooltip text to show when the node is on hover*/
			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";
			networkSeries.nodes.template.tooltipText = "{name} \n {principal}";
			networkSeries.nodes.template.circle.disabled = true;
			networkSeries.nodes.template.outerCircle.disabled = true;				
			/*Icon
			https://www.amcharts.com/docs/v4/chart-types/force-directed/, section: Nodes as images*/
			let icon = networkSeries.nodes.template.createChild(am4core.Sprite);
			icon.propertyFields.path = "path";
			icon.horizontalCenter = "middle";
			icon.verticalCenter = "middle";
			icon.width = this.maxRadius;
			icon.height = this.maxRadius;
			icon.scale = 0.5;
			/*Events: Disable native mobility
			https://www.amcharts.com/docs/v4/chart-types/force-directed/, section: Friction and mobility*/
			networkSeries.events.on("inited", function() {
				networkSeries.animate({
					property: "velocityDecay",
					to: 1
				}, 3000);
			});
			/*Events: Fix dragged nodes
			https://codepen.io/team/amcharts/pen/VwLYqPa, title: Force-directed tree : Fix dragged nodes*/
			/*Enables to drag the nodes across the chart*/
			networkSeries.dragFixedNodes = true;		
			networkSeries.nodes.template.events.on("dragstop", function(event) {
				event.target.dataItem.fixed = true;  
			});
			networkSeries.nodes.template.events.on("down", function(event) {
				event.target.dataItem.fixed = false;  
			});
			/*Sets the new x and y values*/
			networkSeries.nodes.template.events.on("dragged", function(event) {
				event.target.dataItem.fixed = false;  
				var id = event.target.dataItem.id;
				this.chart.series.values[0].dataItems.values[id].dataContext.x = event.target.dataItem.node.x; 
				this.chart.series.values[0].dataItems.values[id].dataContext.y = event.target.dataItem.node.y;
			}, this);
			/*Events: Nodes selection
			https://www.amcharts.com/demos/force-directed-adding-links/, title: Force-directed adding links */
			var selectedNodes = [];
			networkSeries.nodes.template.events.on("up", function (event) {
				var node = event.target;
				if (selectedNodes.indexOf(node) === -1) {
					node.outerCircle.disabled = false;
					selectedNodes.push(node);
					this.selectedParticipants.push(this.participants[node.index]);
				}
				else {
					node.outerCircle.disabled = true;
					selectedNodes.forEach(element => {
						var index = selectedNodes.indexOf(node);
						if(index > -1){
							selectedNodes.splice(index, 1);
							this.selectedParticipants.splice(index, 1);
						}
					});
				}
			}, this);
			/*Sets all nodes chart participants into the right drawer*/
			this.allParticipants = this.participants;
			/*Sets the rightDrawerParticipantUsername to null as the chart may be reseted*/
			this.rightDrawerParticipantUsername = null;
		},

		/*
		@fvillarrealcespedes:
		Disposes the current nodes chart.
		*/
		disposeChart(){
			if(this.chart){
				this.chart.dispose();
			}
		},

		/*
		@fvillarrealcespedes:
		Sets the maximum possible value for rows and columns depending of the users quantity when the per rows or per column classroom 
		configurations are selected.
		*/
		setMaxValue(){
			if(this.users === 2){
				return 2;
			}
			else if(this.users < 10){
				return Math.ceil(this.users/2);
			}else{
				return 10;
			}
		},

		/*
		@fvillarrealcespedes:
		Sets the value options to select for rows and columns depending of the users quantity when the per rows or per column classroom 
		configurations are selected, this values are between one and ten.
		*/
		setValueOptions(){
			var values = []
			for(var i=2; i<=this.setMaxValue(); i++){
				var value = Math.ceil(this.users/i);
				if(values.indexOf(value) === -1 && value <= 10){
					values.push(value);
				}
			}
			function compare ( a, b ){ return a - b; }
			return values.sort( compare );
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, updates the metrics values when the EventSource sends it.
		Includes a call to update the nodes chart.
		*/
    updateMetrics(newMetrics, metric) {
      if (this.participants.length === 0) {
				this.participants = [...newMetrics];
				this.users = this.participants.length;
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
				this.allParticipants = this.participants;
			}
		},

		/*
		@fvillarrealcespedes:
		Sets the new values for the nodes chart nodes. First, the principal metric value is updated, then just in case that the alert 
		option is enabled the nodes color are also updated.
		*/
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
			}
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, gets the session init time and sets it to the store. 
		Also the clock component show condition is setted true.
		*/
		async getInitTime(){
			await axios
			.get(`${process.env.VUE_APP_API_URL}/inittime`)
			.then(response => {
				this.initTime = response.data.initTime;
				console.log(response.data.initTime)
				this.showClock = true;
			})
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Sets the color for each nodes depending on the principal metric value when the alert option is setted "1" or "2". If the alert 
		option is setted "", the color is always the same, blue.
		*/
		setColor(value){
			switch(this.option){
				/*The value must not exceed the limit*/
				case "1":
					/*Red when the value exceeds the limit*/
					if(value > Number(this.limit)){
						return '#F44336';
					}
					/*Orange when the value is the same that the limit*/
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					/*Green when the value is under the limit*/
					else{
						return '#4CAF50';
					}	
					break;	
				/*The value must not be under the limit*/			
				case "2":
					/*Red when the value is under the limit*/
					if(value < Number(this.limit)){
						return '#F44336';
					}
					/*Orange when the value is the same that the limit*/
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					/*Green when the value exceeds the limit*/
					else{
						return '#4CAF50';
					}	
					break;
				/*Blue if the alert option is disabled*/									
				default:
					return '#2196F3';
					break;
			}
		},

		/*
		@fvillarrealcespedes:
		Gets the custom classroom configurations availables.
		*/
    async getClassroomConfigurations(){
      await axios
      .get('http://localhost:4003/classroom-configurations')
      .then(response => {
				this.appendClassroomConfigurations(response.data);
      })
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Adds the custom classroom configurations availables to the array that includes circle, per rows and per columns classroom 
		configurations.
		*/
		appendClassroomConfigurations(payload){
			for(var i=0; i<payload.length; i++){
				if(this.classroomConfigurations.indexOf(payload[i]) != 1){
					this.classroomConfigurations.push(payload[i]);
				}
			}
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, ends the current session. Closes the EventSource, sends a request to end the session and finally 
		enables and disables tabs from the left drawer.
		*/
    async endSession() {
			(this.participants = []), this.eventSource.close();
			await axios
			.get(`${process.env.VUE_APP_API_URL}/endsession`)
			.then(response => {
				this.$router.push('/session-stats');
				this.tabs[0].disabled = false;
				this.tabs[1].disabled = true;				
      });
    },

		async waitInitTime() {
			await this.sleep(3000);
			this.getInitTime();
		},

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	},		

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the classroom configuration property and calculates the height for the nodes chart when the selected configuration is circle.
		*/		
		classroomConfiguration: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && (this.classroomConfiguration === 1 || this.classroomConfiguration === 4)){
				this.setHeight(this.classroomConfiguration);
			}
		},

		/*
		@fvillarrealcespedes:
		Watches the rows property and calculates the height for the nodes chart when the selected configuration is per rows.
		*/		
		rows: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && this.rows !== ''){
				this.setHeight(this.classroomConfiguration);
			}
		},

		/*
		@fvillarrealcespedes:
		Watches the columns property and calculates the height for the nodes chart when the selected configuration is per columns.
		*/		
		columns: function(){
			if(this.classroomConfiguration !== '' && this.users > 1 && this.columns !== ''){
				this.setHeight(this.classroomConfiguration);
			}
		},

		/*
		@fvillarrealcespedes:
		Watches the rightDrawerParticipantUsername property, with a for loop finds the associated node to this username. Then shows the 
		node tooltip by setting the showTooltipOn as "always", also hides all others, with the tooltip hide() method. Sets for 
		all nodes the showTooltipOn property as "hover" to not display them permanently, finally sets the rightDrawerParticipantUsername 
		property as null in case the new setted value is exactly the same that the old one. 
		*/	
		rightDrawerParticipantUsername: function(){
			if(this.rightDrawerParticipantUsername){
				for(var i=0; i<this.users; i++){
					if(this.rightDrawerParticipantUsername === this.chart.series.values[0].dataItems.values[i].name){
						this.chart.series.values[0].dataItems.values[i].node.showTooltipOn = "always";
					}else{
						this.chart.series.values[0].dataItems.values[i].node.tooltip.hide();
					}
					this.chart.series.values[0].dataItems.values[i].node.showTooltipOn = "hover";
				}
				this.rightDrawerParticipantUsername = null;
			}
		}
	}, 

	computed: {
		/*
		@fvillarrealcespedes:
		Condition to show the line chart, get and set methods are imported from the store.
		*/		
		showLineChart: {
			get () {
				return this.$store.getters.getShowLineChart;
			},
      set (payload){
        this.$store.commit('setShowLineChart', payload);
      }			
		},

		/*
		@fvillarrealcespedes:
		Left drawer tabs, get and set methods are imported from the store.
		*/		
		tabs: {
      get () {
        return this.$store.getters.getTabs;
      },
      set (payload) {
        this.$store.commit('setTabs', payload);
      },
		},

    /*
		@fvillarrealcespedes:
		SelectedParticipants to display in the right drawer, get and set methods are imported from the store.
		*/	    
    selectedParticipants: {
      get () {
        return this.$store.getters.getSelectedParticipants;
      },
      set (payload) {
        this.$store.commit('setSelectedParticipants', payload);
      }
    },

    /*
		@fvillarrealcespedes:
		AllParticipants to display in the right drawer, get and set methods are imported from the store.
		*/	    
    allParticipants: {
      get () {
        return this.$store.getters.getAllParticipants;
      },
      set (payload) {
        this.$store.commit('setAllParticipants', payload);
      }
		},
		
    /*
		@fvillarrealcespedes:
		RightDrawerParticipantUsername to find in the nodes chart the selected participant from the left drawer, get and set methods are 
		imported from the store.
		*/	    
    rightDrawerParticipantUsername: {
      get () {
        return this.$store.getters.getRightDrawerParticipantUsername;
      },
      set (payload) {
        this.$store.commit('setRightDrawerParticipantUsername', payload);
      }
    },		

		/*
		@fvillarrealcespedes:
		LineChartUsername for the line chart, get and set methods are imported from the store.
		*/	
    lineChartUsername: {
      get (){
        return this.$store.getters.getLineChartUsername;
      },      
      set (payload){
        this.$store.commit('setLineChartUsername', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		LineChartSelectedMetric for the line chart, get and set methods are imported from the store.
		*/	
    lineChartSelectedMetric: {
      get (){
        return this.$store.getters.getLineChartSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setLineChartSelectedMetric', payload);
      }
    },
    
		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
			},
		}    
	}
}
</script>

<style scoped>
.classroom {
  width: 100%;
}
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
</style>