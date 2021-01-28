<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('classroom.header') }}</h2>
				<v-divider></v-divider>	
				<br>
				<!-- Chronometer component only visible when showChronometer property is true -->
				<Chronometer v-if="showChronometer"/>
				<!-- Form to set the classroom configuration for the node chart -->
				<v-form
					ref="configurationForm"
					v-model="validConfiguration"
					v-if="users != 0"
				>
					<!-- Select for the classroom configuration to display the nodes -->
					<v-row>
						<v-col cols="8">
					<v-select
						v-model="classroomConfiguration"
						:items="filterConfigurations(allClassroomConfigurations)"
						item-value="id"
						item-text="name"
						:label="$t('classroom.visualization')"
						prepend-icon="mdi-format-list-bulleted"
						required
						:rules="selectRules"
					>
					</v-select>	
					<!-- Select for the rows number in case the classroom configuration by rows is selected -->
					<v-select
						:items="setValueOptions()"
						v-model="rows"
						v-if="classroomConfiguration === 2"
						:label="$t('classroom.rowsQuantity')"
						prepend-icon="mdi-view-sequential"
						required
						:rules="selectRules"						
					>
					</v-select>
					<!-- Select for the columns number in case the classroom configuration by columns is selected -->
					<v-select
						:items="setValueOptions()"
						v-model="columns"
						v-if="classroomConfiguration === 3"
						:label="$t('classroom.colsQuantity')"
						prepend-icon="mdi-view-column"
						required
						:rules="selectRules"						
					>
					</v-select>										
					</v-col>
					<v-col cols="4">
						<!-- Node chart displayer/updater button -->
						<v-btn
							color="success"
							:disabled="!validConfiguration"
							@click="setClassroom(classroomConfiguration)"
						>
							<template
								v-if="!chart"
							>
								{{ $t('buttons.charts.generate') }}	
								<v-icon right>
									mdi-check
								</v-icon>							
							</template>
							<template
								v-else
							>
								{{ $t('buttons.charts.update') }}	
								<v-icon right>
									mdi-refresh
								</v-icon>							
							</template>
						</v-btn>
					</v-col>
					</v-row>
				</v-form>	
				<!-- Other charts displayer and action buttons -->
				<v-row 
					v-if="users != 0"
				>
					<v-col cols="8">
						<div 
							v-if="users != 0"	
						>	
							<!-- Bar chart displayer button -->
							<v-btn
								class="mb-4 ms-4"
								color="purple darken-2"
								dark
								@click="showBarChart = true"
								v-if="chart"
							>
								{{ $t('buttons.charts.barChart') }}	
								<v-icon right>
									mdi-chart-bar
								</v-icon>
							</v-btn>
							<!-- Line chart displayer button -->
							<v-btn
								class="mb-4 ms-4"
								color="purple darken-2"
								dark
								@click="showLineChart = true"
								v-if="chart"								
							>
								{{ $t('buttons.charts.lineChart') }}	
								<v-icon right>
									mdi-chart-line
								</v-icon>
							</v-btn>	
						</div>
					</v-col>
					<v-col cols="4">
						<!-- Current session ender button -->
						<v-btn
							color="error"
							@click="endSession()"
						>
							{{ $t('classroom.endSession') }}	
							<v-icon right>
								mdi-power
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<div 
					v-else
				>
  				<p class="text-center mt-12">
						{{ $t('classroom.loading') }}
					</p>
					<!-- Progress linear-->
					<v-progress-linear 
						indeterminate
						color="primary"
					>
					</v-progress-linear>			
				</div>
				<!-- Sessión settings info -->
				<div class="mt-4 mb-4" v-if="users != 0">
					<v-card>
						<v-row class="text-center">
							<v-col cols="4">
								<!-- Participants quantity -->
								<span>
									{{ $t('classroom.participants') }}: {{this.users}}
								</span>
							</v-col>
							<v-col cols="4">
								<!-- Principal metric -->
								<span>
									{{ $t('classroom.principal') }}: {{this.setAlias(this.principal)}}
								</span>
							</v-col>
							<v-col cols="4">
								<!-- Metric limit value -->
								<span>
									{{ $t('classroom.limit') }}: {{this.setLimit()}}
								</span>
							</v-col>				
						</v-row>
					</v-card>					
				</div>
				<div class="loading" v-if="loading">
					<p class="text-center mt-12">
						{{ $t('charts.loading') }}
					</p>
					<!-- Progress linear-->
					<v-progress-linear 
						indeterminate
						color="primary"
					>
					</v-progress-linear>			
				</div>								
				<!-- Node chart -->
				<div class="classroom" ref="chartdiv"></div>
				<!-- Line chart dialog -->
				<v-dialog
					v-model="showLineChart"
					max-width="80%"
					persistent				
				>
					<v-card>
						<!-- Line chart -->
						<LineChart ref="lineChart"/>
						<v-card-actions>
							<v-spacer></v-spacer>
							<!-- Line chart dialog closer button -->
							<v-btn
								color="error"
								@click="resetLineChart()"
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
				<!-- Bar chart dialog -->
				<v-dialog
					v-model="showBarChart"
					max-width="80%"
					persistent				
				>
					<v-card>
						<BarChart ref="barChart"/>
						<v-card-actions>
							<v-spacer></v-spacer>
							<!-- Bar chart dialog closer button -->
							<v-btn
								color="error"
								@click="resetBarChart()"
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
      </v-col>
		</v-row>
	</v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import BarChart from '../Classroom/BarChart';
import LineChart from '../Classroom/LineChart';
import Chronometer from '../Classroom/Chronometer';
import { mapActions, mapState } from 'vuex';
import axios from 'axios';

/*
@fvillarrealcespedes:
Chart library imports.
*/
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";

am4core.useTheme(am4themes_animated);

export default {
	name: 'Classroom',

	components: {
		BarChart,
		LineChart,
		Chronometer
	},

	data (){
		return {
			/*Component properties*/
			chart: null,
			classroomConfiguration: '',
			columns: '',
			loading: null,
			rows: '',
			users: 0,
			validConfiguration: true,
			/*Chart properties*/
			height: 0,
			/*Specific nodes properties*/
			fontsize: 0,
			maxRadius: 0,
			separation: 0,
			userIcoPath: 'M55,27.5C55,12.337,42.663,0,27.5,0S0,12.337,0,27.5c0,8.009,3.444,15.228,8.926,20.258l-0.026,0.023l0.892,0.752c0.058,0.049,0.121,0.089,0.179,0.137c0.474,0.393,0.965,0.766,1.465,1.127c0.162,0.117,0.324,0.234,0.489,0.348	c0.534,0.368,1.082,0.717,1.642,1.048c0.122,0.072,0.245,0.142,0.368,0.212c0.613,0.349,1.239,0.678,1.88,0.98	c0.047,0.022,0.095,0.042,0.142,0.064c2.089,0.971,4.319,1.684,6.651,2.105c0.061,0.011,0.122,0.022,0.184,0.033	c0.724,0.125,1.456,0.225,2.197,0.292c0.09,0.008,0.18,0.013,0.271,0.021C25.998,54.961,26.744,55,27.5,55	c0.749,0,1.488-0.039,2.222-0.098c0.093-0.008,0.186-0.013,0.279-0.021c0.735-0.067,1.461-0.164,2.178-0.287	c0.062-0.011,0.125-0.022,0.187-0.034c2.297-0.412,4.495-1.109,6.557-2.055c0.076-0.035,0.153-0.068,0.229-0.104	c0.617-0.29,1.22-0.603,1.811-0.936c0.147-0.083,0.293-0.167,0.439-0.253c0.538-0.317,1.067-0.648,1.581-1	c0.185-0.126,0.366-0.259,0.549-0.391c0.439-0.316,0.87-0.642,1.289-0.983c0.093-0.075,0.193-0.14,0.284-0.217l0.915-0.764	l-0.027-0.023C51.523,42.802,55,35.55,55,27.5z M2,27.5C2,13.439,13.439,2,27.5,2S53,13.439,53,27.5	c0,7.577-3.325,14.389-8.589,19.063c-0.294-0.203-0.59-0.385-0.893-0.537l-8.467-4.233c-0.76-0.38-1.232-1.144-1.232-1.993v-2.957	c0.196-0.242,0.403-0.516,0.617-0.817c1.096-1.548,1.975-3.27,2.616-5.123c1.267-0.602,2.085-1.864,2.085-3.289v-3.545	c0-0.867-0.318-1.708-0.887-2.369v-4.667c0.052-0.52,0.236-3.448-1.883-5.864C34.524,9.065,31.541,8,27.5,8	s-7.024,1.065-8.867,3.168c-2.119,2.416-1.935,5.346-1.883,5.864v4.667c-0.568,0.661-0.887,1.502-0.887,2.369v3.545	c0,1.101,0.494,2.128,1.34,2.821c0.81,3.173,2.477,5.575,3.093,6.389v2.894c0,0.816-0.445,1.566-1.162,1.958l-7.907,4.313	c-0.252,0.137-0.502,0.297-0.752,0.476C5.276,41.792,2,35.022,2,27.5z',
			/*Original NEURONE-AM properties*/
			eventSource: null,
			limit: 0,
			option: '',
			participants: [],
			principal: '',
			sessionMetrics: [],
			/*Chronometer component show condition*/
			showChronometer: false,
			/*Arrays*/
			allClassroomConfigurations: [
				//{ id: 1, name: this.$t('classroom.classroomConfigurations.circle'), participants: 50 },
				{ id: 2, name: this.$t('classroom.classroomConfigurations.perRows'), participants: 100 },
				{ id: 3, name: this.$t('classroom.classroomConfigurations.perColumns'), participants: 100 }
			],
			valueOptions: [],
			/*Rules*/
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
			selectRules: [
        v => v && v != null || this.$t('rules.selectRule')
			]
		}
	},

	/*
	@fvillarrealcespedes:
	NEURONE-AM original method, invoked before the rendering.
	Gets the session settings from store, sets the EventSource to receive the metrics, gets the session init time, the classroom 
	configurations and finally enables and disables tabs from the left drawer.
	*/
	created(){
		this.sessionMetrics = this.settings.metrics;
		this.principal = this.settings.principal;
		this.limit = this.settings.limit;
		this.option = this.settings.option;
		this.eventSource = new EventSource(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/init`);
		this.waitInitTime();
		this.sessionMetrics.map(metric => {
			this.eventSource.addEventListener(metric, e => {
				this.updateMetrics(JSON.parse(e.data), metric);
			});
		});
		this.tabs[0].disabled = true;
		this.tabs[1].disabled = false;
		this.appendClassroomConfigurations();
	},

	/*
	@fvillarrealcespedes:
	Invoked after created(), initializes some component properties, mainly the related to node chart.
	*/
	mounted(){
		this.fontsize = 13;
		this.maxRadius = 18;
		this.separation = 60;
		this.selectedParticipants = [];
		this.allParticipants = [];
		this.classroomChartOn = false;
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
		Adds the custom classroom configurations availables to the array that includes circle (just for tests), per rows and per columns classroom 
		configurations.
		*/
		appendClassroomConfigurations(){
			for(var i=0; i<this.classroomConfigurations.length; i++){
				this.allClassroomConfigurations.push(this.classroomConfigurations[i]);
			}
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
		Disposes the current node chart.
		*/
		disposeChart(){
			if(this.chart){
				this.chart.dispose();
			}
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, ends the current session. Closes the EventSource, sends a request to end the session and finally 
		enables and disables tabs from the left drawer.
		*/
    async endSession() {
			(this.participants = []), this.eventSource.close();
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/end`)
			.then(response => {
				this.tabs[0].disabled = true;
				this.tabs[1].disabled = false;
				this.tabs[2].disabled = true;
				this.tabs[3].disabled = true;			
				this.$router.replace('/session-stats');
      });
    },		

		/*
		@fvillarrealcespedes:
		Filters from allClassroomConfigurations array the classroom configurations where the participants property is equal or lower than current users in session.
		*/
		filterConfigurations(configurations){
			return configurations.filter(configuration => configuration.participants >= this.users);
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, gets the session init time and sets it to store. 
		Also the Chronometer component show condition is setted true.
		*/
		async getInitTime(){
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/inittime`)
			.then(response => {
				this.initTime = response.data.initTime;
				this.showChronometer = true;
			})
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		Hides the line bar component and disposes the chart itself.
		*/
		resetBarChart(){
			this.showBarChart = false;
			this.$refs.barChart.disposeChart();
		},

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
		Searches in metrics array the metric object where name property equals the given name param, then returns that object alias.
		*/
    setAlias(name){
			var metric = this.metrics.find(metric => metric.name == name);
      return metric.alias;
    },

		/*
		@fvillarrealcespedes:
		Sets all node chart properties, from height to nodes and available events.
		*/
		setChart(data){
			/*Chart creation*/
			this.chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			/*Sets chart container height*/
			this.chart.svgContainer.htmlElement.style.height = this.height + "px";
			/*Background properties*/
			this.chart.background.fill = "#2196F3";
			this.chart.background.opacity = 0.1;
			this.chart.logo.height = -15000;
			/*Creates data series for chart*/
			var networkSeries = this.chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
			/*Sets series data and datafields*/
			networkSeries.data = data;
			networkSeries.dataFields.fixed = "fixed";
			networkSeries.dataFields.id = "id";
			networkSeries.dataFields.name = "name";
			networkSeries.dataFields.value = "value";
			networkSeries.dataFields.color = "color";
			/*Sets font size and node maximum radius*/
			networkSeries.fontSize = this.fontsize;
			networkSeries.maxRadius = this.maxRadius;
			/*Sets node properties as label and the maximum and minimum values for x and y coordinates in chart*/
			networkSeries.nodes.template.fillOpacity = 1;
			networkSeries.nodes.template.label.text = "{id}"
			networkSeries.nodes.template.label.fill = "#000000";
			networkSeries.nodes.template.maxX = this.$refs.chartdiv.clientWidth;
			networkSeries.nodes.template.maxY = this.$refs.chartdiv.clientHeight - 25;
			networkSeries.nodes.template.minX = 0;
			networkSeries.nodes.template.minY = 25;			
			/*Sets node properties as x and y to set position in chart and the tooltip text to show when node is on hover*/
			networkSeries.nodes.template.label.dx = 20;
			networkSeries.nodes.template.label.dy = 20;
			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";
			networkSeries.nodes.template.tooltipText = "[bold]{name}[/] \n {principal}";
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
			icon.scale = 0.65;
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
			/*Sets new x and y values*/
			networkSeries.nodes.template.events.on("dragged", function(event) {
				event.target.dataItem.fixed = false;  
				var id = event.target.dataItem.id - 1;
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
			/*Sets title and its font properties*/
			let title = this.chart.titles.create();
			title.text = this.$t('charts.node.title');
			title.fontWeight = "bold";
			title.fontSize = 25;	
			/*Sets classroomChartOn boolean property true*/
			this.classroomChartOn = true;
			this.rightDrawerOption = 1;
			this.loading = false;
		},

		/*
		@fvillarrealcespedes:
		Sets the data for node chart depending on index param with a switch-case, case 1 for circle configuration (just for tests), 2 for rows configurations, 
		3 for columns configuration and a default case for custom configurations.
		*/
		setClassroom(index){
			this.selectedParticipants = [];		
			this.allParticipants = [];	
			this.loading = true;
			var data = [];
			switch(index){
				case 1: /*Just for tests*/
					this.setClassroomInCircle(data);
					this.setHeight(data);
					break;
				case 2:
					this.setClassroomPerRows(data);
					this.setHeight(data);
					break;
				case 3:
					this.setClassroomPerColumns(data);
					this.setHeight(data);
					break;
				default:
					this.setCustomClassroom(data, index);
			}
			this.disposeChart();
			this.setChart(data);
			/*Bug fixer to display the circle configuration classroom, chart needs to be recreated once*/
			if(index === 1){
				this.disposeChart();
				this.setChart(data);
			}
			/*Sets all node chart participants into the right drawer*/
			this.allParticipants = this.participants;
			/*Sets the rightDrawerParticipantUsername to null as the chart may be reseted*/
			this.rightDrawerParticipantUsername = null;
		},

		/*
		@fvillarrealcespedes:
		Sets nodes chart nodes in circle (just for tests). Uses the principal metric value to set a color for the node in case the alert option 
		is enabled, then creates the data object for the node and pushes it to the data array.
		*/
		setClassroomInCircle(data){
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);
				data.push(
					{
						id: i+1,
						name: this.participants[i].username,
						principal: this.setAlias(this.principal) + ': ' + value,
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
		Sets nodes chart nodes in columns. Calculates the numbers of nodes per column and an offset to align the nodes to
		chart center. Uses the principal metric value to set a color for the node in case the alert option is enabled, then creates the 
		data object for the node and pushes it to the data array.
		*/
		setClassroomPerColumns(data){		
			var nodesPer = Math.ceil(this.users/this.columns);
			var offset = this.setOffset(this.users/nodesPer) + this.separation/2;
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);			
				var x = this.separation * Math.trunc(i/nodesPer) + offset;
				var y = this.separation/2 + this.separation * (i % nodesPer);
				data.push(
					{
						id: i+1,
						name: this.participants[i].username,
						principal: this.setAlias(this.principal) + ': ' + value,
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
		Sets nodes chart nodes in rows. Calculates the numbers of nodes per row and an offset to align the nodes to the chart 
		center. Uses the principal metric value to set a color for the node in case the alert option is enabled, then creates the data 
		object for the node and pushes it to the data array.
		*/
		setClassroomPerRows(data){
			var nodesPer = Math.ceil(this.users/this.rows);
			var offset = this.setOffset(nodesPer) + this.separation/2;
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);		
				var x = this.separation * (i % nodesPer) + offset;
				var y = this.separation/2 + this.separation * Math.trunc(i/nodesPer);
				data.push(
					{
						id: i+1,
						name: this.participants[i].username,
						principal: this.setAlias(this.principal) + ': ' + value,
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
		Sets the color for each nodes depending on the principal metric value when the alert option is setted "1" or "2". If the alert 
		option is setted "", the color is always the same, blue.
		*/
		setColor(value){
			switch(this.option){
				/*The value must not be over the limit*/
				case "1":
					/*Red when the value is over the limit*/
					if(value > Number(this.limit)){
						return '#F44336';
					}
					/*Orange when the value equals the limit*/
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
					/*Orange when the value equals the limit*/
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					/*Green when the value is over the limit*/
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
		Sets nodes chart nodes in a custom configuration. First, searches in the allClassroomConfigurations array a classroom configuration where
		the name equals the index param. Then calculates an offset to align the nodes to chart center. Uses the principal metric value to set a 
		color for the node in case the alert option is enabled, then creates the data object for the node and pushes it to the data array.
		*/
		setCustomClassroom(data, index){	
			var customConfiguration = this.allClassroomConfigurations.find(configuration => configuration.name === index);
			var offset = this.setCustomOffset(customConfiguration.width);
			for(var i = 0; i < this.users; i++){
				var value = this.participants[i].results[this.principal];
				var color = this.setColor(value);
				var x = customConfiguration.positions[i][0];
				var y = customConfiguration.positions[i][1];
				data.push(
					{
						id: i+1,
						name: this.participants[i].username,
						principal: this.setAlias(this.principal) + ': ' + value,
						path: this.userIcoPath,
						color: color,
						fixed: true, 
						value: 1,
						x: x,
						y: y
					}
				);
			}
			this.setHeight(data);
		},

		/*
		@fvillarrealcespedes:
		Sets the height propery based on the custom configuration nodes positions.
		*/
		setCustomHeight(data, savedHeight){
			var maxHeight = 0;
			data.forEach(element => {
				if(element[1] > maxHeight){
					maxHeight = element[1];
				}
			});
			var minHeight = savedHeight;
			data.forEach(element => {
				if(element[1] < minHeight){
					minHeight = element[1];
				}
			});			
			this.height = maxHeight - minHeight;
			if(this.height < 150){
				this.height = 200;
			}else{
				this.height = this.height + this.separation*2;			
			}			
		},

		/*
		@fvillarrealcespedes:
		Sets an offset to align the node chart nodes to center in case that the selected classroom configuration is custom.
		*/
		setCustomOffset(customWidth){
			return (this.$refs.chartdiv.clientWidth - customWidth)/2;
		},

		/*
		@fvillarrealcespedes:
		Sets node chart height depending on data array param elements.
		*/
		setHeight(data){
			var height = 0;
			data.forEach(element => {
				if(element.y > height){
					height = element.y;
				}
			})
			this.height = height + this.separation;
		},	

		/*
		@fvillarrealcespedes:
		Sets the limit property value, if settings object limit property value is not zero return this value, else return a translation for "undefined".
		*/
		setLimit(){
			if(this.settings.limit){
				return this.settings.limit;
			}
			return this.$t('classroom.undefined');
		},

		/*
		@fvillarrealcespedes:
		Sets the maximum possible value for rows and columns depending on users quantity when per rows or per column classroom configurations is selected.
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
		Sets an offset to align the node chart nodes to center in case that the selected classroom configuration is per rows or per columns.
		*/
		setOffset(nodesPer){
			return (this.$refs.chartdiv.clientWidth - nodesPer*this.separation)/2;
		},

		/*
		@fvillarrealcespedes:
		Sets value options to select for rows and columns depending on users quantity when per rows or per column classroom configurations is selected, 
		this values are between one and ten.
		*/
		setValueOptions(){
			var values = []
			for(var i=1; i<=this.setMaxValue(); i++){
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
		Helper method to wait for a given time in milliseconds.
		*/	
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},

		/*
		@fvillarrealcespedes:
		Sets the new values for node chart nodes. First, the principal metric value is updated, then just in case that the alert 
		option is enabled the nodes color are also updated.
		*/
		updateChart(){
			/*Used for performance test*/
			/*console.time('updateChart');*/			
			/*Principal update*/
			for(var i=0; i<this.users; i++){
				this.chart.series.values[0].data[i].principal = this.setAlias(this.principal) + ': ' + this.participants[i].results[this.principal];
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
			/*Used for performance test*/
			/*console.timeEnd('updateChart');*/		
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, updates the metrics values when the EventSource sends it.
		Includes a call to update the node chart.
		*/
    updateMetrics(newMetrics, metric) {
      if (this.participants.length === 0) {
				this.participants = [...newMetrics];
				this.users = this.participants.length;
				this.sessionParticipants = this.participants.length;
				this.dispatchNotification('classroom.participantsLoaded', 'information', 5000, 'info');
      } else {
				/*Used for performance test*/
				/*console.time('updateMetrics');*/
        newMetrics.map((metric, i) => {
          this.participants[i].results = Object.assign(
            {},
            this.participants[i].results,
            metric.results
          );
				});
				/*Used for performance test*/
				/*console.timeEnd('updateMetrics');*/
			}
			/*Node chart update*/
			if(this.chart){
				this.updateChart();
				this.allParticipants = this.participants;
			}
		},

		/*
		@fvillarrealcespedes:
		Helper method to wait for a request and then gets the session init time.
		*/
		async waitInitTime() {
			await this.sleep(3000);
			this.getInitTime();
		}	
	},		

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the chart property, in case the chart is disposed emptys the allParticipants array.
		*/
		chart: function(){
			if(!this.chart){
				this.allParticipants = [];
			}
		},

		/*
		@fvillarrealcespedes:
		Watches the classroomConfigurations property, when this isn't null calls for appendClassroomConfigurations method.
		*/
		classroomConfigurations: function(){
			if(this.classroomConfigurations){
				this.appendClassroomConfigurations();
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
		AllParticipants to display in the right drawer, get and set methods are imported from store.
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
		Boolean property to alert if the node chart is being showed or not, get and set methods are imported from store.
		*/
		classroomChartOn: {
      get () {
        return this.$store.getters.getClassroomChartOn;
      },
      set (payload) {
        this.$store.commit('setClassroomChartOn', payload);
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
		},		

		/*
		@fvillarrealcespedes:
		Session InitTime, get and set methods are imported from store.
		*/	
		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
			}
		},		

		/*
		@fvillarrealcespedes:
		LineChartSelectedMetric for the line chart, get and set methods are imported from store.
		*/	
    lineChartSelectedMetric: {
      get (){
        return this.$store.getters.getLineChartSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setLineChartSelectedMetric', payload);
      }
    },
			
		/*
		@fvillarrealcespedes:
		LineChartUsername for the line chart, get and set methods are imported from store.
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
		Array that includes all available performance metrics in NEURONE-AM, get and set methods are imported from store.
		*/	
		metrics: {
			get () {
				return this.$store.getters.getMetrics;
			},
			set (payload) {
				this.$store.commit('setMetrics', payload);
			}
		},

		/*
		@fvillarrealcespedes:
    Option to select the right drawer visualization option, get and set methods are imported from store. 
    */  
		rightDrawerOption: {
			get () {
				return this.$store.getters.getRightDrawerOption;
			},
			set (payload) {
				this.$store.commit('setRightDrawerOption', payload);
			},
		}, 
		
    /*
		@fvillarrealcespedes:
		RightDrawerParticipantUsername to find in node chart the selected participant from left drawer, get and set methods are 
		imported from store.
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
		SelectedParticipants to display in the right drawer, get and set methods are imported from store.
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
		SessionParticipants, get and set methods are imported from store.
		*/	    
    sessionParticipants: {
      get () {
        return this.$store.getters.getSessionParticipants;
      },
      set (payload) {
        this.$store.commit('setSessionParticipants', payload);
      }
    },		

		/*
		@fvillarrealcespedes:
		Object that includes all session settings, get and set methods are imported from store.
		*/	
		settings: {
			get () {
				return this.$store.getters.getSettings;
			},
			set (payload) {
				this.$store.commit('setSettings', payload);
			}
		},		

		/*
		@fvillarrealcespedes:
		Condition to show the line chart, get and set methods are imported from store.
		*/		
		showBarChart: {
			get () {
				return this.$store.getters.getShowBarChart;
			},
      set (payload){
        this.$store.commit('setShowBarChart', payload);
      }			
		},

		/*
		@fvillarrealcespedes:
		Condition to show the bar chart, get and set methods are imported from store.
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
		Left drawer tabs, get and set methods are imported from store.
		*/		
		tabs: {
      get () {
        return this.$store.getters.getTabs;
      },
      set (payload) {
        this.$store.commit('setTabs', payload);
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
.loading{
	width: 80%;
	margin-left: 10%;
}
</style>