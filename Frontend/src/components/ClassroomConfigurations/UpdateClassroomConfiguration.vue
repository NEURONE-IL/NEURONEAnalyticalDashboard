<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('classroomConfigurations.updateHeader') }}</h2>
				<br>
				<v-divider></v-divider>	
				<br>	
        <!-- UpdateClassroomConfiguration form -->				
				<v-form
					ref="editConfigurationForm"
					v-model="editValidConfiguration"
				>
					<v-row no-gutters>
						<v-col cols="12" md="5" class="text-center ms-12">
              <!-- Name property input field -->
							<v-text-field
								v-model="classroomConfiguration.name"
								:label="$t('labels.name')"
								required
								:rules="requiredLengthRules"
								prepend-inner-icon="mdi-new-box"
								:counter="50"
							>
							</v-text-field>					
						</v-col>
						<v-col cols="12" md="5" class="text-center ms-12">
              <!-- Participants quantity property selectionable field -->
							<v-slider
								v-model="classroomConfiguration.participants"
								thumb-label="always"
								:thumb-size="16"              
								thumb-color="primary"
								:label="$t('labels.usersQuantity')"
								:min= 1
								:max= 100
								required
								:rules="requiredRules"
								class="mt-4"
							>
							</v-slider> 
						</v-col>
					</v-row>
				</v-form>	
				<br>
				<v-divider></v-divider>	
				<br>	
				<!-- Button to set and modify the nodes chart -->
				<v-btn
					class="mb-4 ms-4"
					color="primary"	
					@click="setClassroom()"
				>
					{{ $t('buttons.configurePositions') }}
					<v-icon right>
						mdi-cursor-default
					</v-icon>
				</v-btn>
				<!-- Button to update the classroom configuration, disabled when at least one UpdateClassroomConfiguration form field is invalid, there are 
				not participants or the nodes chart is null -->
				<v-btn
					class="mb-4 ms-4"
					color="success"
					:disabled="!editValidConfiguration || !chart"
					@click="updateConfiguration(classroomConfigurationId)"
				>
					{{ $t('buttons.saveChanges') }}
					<v-icon right>
						mdi-content-save
					</v-icon>
				</v-btn>								
				<!-- Nodes chart, only visible when the container height is different than zero -->
				<div v-show="this.height != 0" class="classrooms" ref="chartdiv"></div>
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
import { mapState, mapActions } from 'vuex';
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
	name: 'UpdateClassroomConfiguration',
	
	data (){
		return {
			/*Component properties*/
			chart: null,
			editValidConfiguration: true,
			classroomConfiguration: {},
			/*Chart properties*/
			height: 0,
			width: 0,			
			/*Specific nodes properties*/
			fontsize: 0,
			maxRadius: 0,
			separation: 0,
			userIcoPath: 'M55,27.5C55,12.337,42.663,0,27.5,0S0,12.337,0,27.5c0,8.009,3.444,15.228,8.926,20.258l-0.026,0.023l0.892,0.752c0.058,0.049,0.121,0.089,0.179,0.137c0.474,0.393,0.965,0.766,1.465,1.127c0.162,0.117,0.324,0.234,0.489,0.348	c0.534,0.368,1.082,0.717,1.642,1.048c0.122,0.072,0.245,0.142,0.368,0.212c0.613,0.349,1.239,0.678,1.88,0.98	c0.047,0.022,0.095,0.042,0.142,0.064c2.089,0.971,4.319,1.684,6.651,2.105c0.061,0.011,0.122,0.022,0.184,0.033	c0.724,0.125,1.456,0.225,2.197,0.292c0.09,0.008,0.18,0.013,0.271,0.021C25.998,54.961,26.744,55,27.5,55	c0.749,0,1.488-0.039,2.222-0.098c0.093-0.008,0.186-0.013,0.279-0.021c0.735-0.067,1.461-0.164,2.178-0.287	c0.062-0.011,0.125-0.022,0.187-0.034c2.297-0.412,4.495-1.109,6.557-2.055c0.076-0.035,0.153-0.068,0.229-0.104	c0.617-0.29,1.22-0.603,1.811-0.936c0.147-0.083,0.293-0.167,0.439-0.253c0.538-0.317,1.067-0.648,1.581-1	c0.185-0.126,0.366-0.259,0.549-0.391c0.439-0.316,0.87-0.642,1.289-0.983c0.093-0.075,0.193-0.14,0.284-0.217l0.915-0.764	l-0.027-0.023C51.523,42.802,55,35.55,55,27.5z M2,27.5C2,13.439,13.439,2,27.5,2S53,13.439,53,27.5	c0,7.577-3.325,14.389-8.589,19.063c-0.294-0.203-0.59-0.385-0.893-0.537l-8.467-4.233c-0.76-0.38-1.232-1.144-1.232-1.993v-2.957	c0.196-0.242,0.403-0.516,0.617-0.817c1.096-1.548,1.975-3.27,2.616-5.123c1.267-0.602,2.085-1.864,2.085-3.289v-3.545	c0-0.867-0.318-1.708-0.887-2.369v-4.667c0.052-0.52,0.236-3.448-1.883-5.864C34.524,9.065,31.541,8,27.5,8	s-7.024,1.065-8.867,3.168c-2.119,2.416-1.935,5.346-1.883,5.864v4.667c-0.568,0.661-0.887,1.502-0.887,2.369v3.545	c0,1.101,0.494,2.128,1.34,2.821c0.81,3.173,2.477,5.575,3.093,6.389v2.894c0,0.816-0.445,1.566-1.162,1.958l-7.907,4.313	c-0.252,0.137-0.502,0.297-0.752,0.476C5.276,41.792,2,35.022,2,27.5z',
			/*Arrays & rules*/
			requiredLengthRules: [
				v => !!v || this.$t('rules.requiredRule'),
				v => v && v.length < 51 || this.$t('rules.maxLength50'),
				v => v && v.length > 4 || this.$t('rules.minLength5')
			],
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			]
		}
	},

	/*
	@fvillarrealcespedes:
	Invoked after create, initializes the specific nodes properties and calls the getter method for a specific classroom configuration by the computed 
	property classroomConfigurationId.
	*/
	mounted(){
		this.fontsize = 13;
		this.maxRadius = 18;
		this.separation = 60;
		this.getClassroomConfiguration(this.classroomConfigurationId);
	},

	methods: {

		...mapActions([
			'getClassroomConfigurations'
		]),

		/*
		@fvillarrealcespedes:
    Sets the data for the nodes chart, disposes the previous nodes chart if exists and finally sets the new one with the classroom configuration 
    actual data array. 
		*/
		async setClassroom(){		
			var data = [];
			this.setCustomClassroom(data);
			this.disposeChart();
			this.setHeight();			
			await this.sleep(0);		
			this.setChart(data);
		},		

		/*
		@fvillarrealcespedes:
    Sets an offset to align the nodes to nodes chart center, there are two cases, in the first one the current nodes chart HTML div is wider 
    than the classroom configuration actual width, in the second the classroom configuration actual width is wider than the current nodes chart 
    HTML div. 
		*/
		setOffset(){
			if(this.$refs.chartdiv.clientWidth > this.classroomConfiguration.width){
				return (this.$refs.chartdiv.clientWidth - this.classroomConfiguration.width)/2;
			}else{
				return (this.classroomConfiguration.width - this.$refs.chartdiv.clientWidth)/2;
			}
		},

		/*
		@fvillarrealcespedes:
		Sets the nodes of the nodes chart in the custom stored positions. Anyway, all nodes can be dragged through the chart.
		*/
		setCustomClassroom(data){
			for(var i = 0; i < this.classroomConfiguration.participants; i++){
				data.push(
					{						
						id: i+1,
						path: this.userIcoPath,
						color: '#2196F3',
						value: 1,
						fixed: true,
						x: this.classroomConfiguration.positions[i][0],
						y: this.classroomConfiguration.positions[i][1]
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
		Sets the height for the nodes chart depending of the current classroom configuration height.
		*/
		setHeight(){
			this.height = this.classroomConfiguration.height;
		},

		/*
		@fvillarrealcespedes:
		Sets all nodes chart properties, from the height, to the nodes and the available events.
		*/
		setChart(data){
			/*Chart creation*/
			this.chart = am4core.create(this.$refs.chartdiv, am4plugins_forceDirected.ForceDirectedTree);
			/*Sets the chart container height*/
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
			networkSeries.dragFixedNodes = true;
			networkSeries.nodes.template.label.dx = 20;
			networkSeries.nodes.template.label.dy = 20;
			networkSeries.nodes.template.propertyFields.x = "x";
			networkSeries.nodes.template.propertyFields.y = "y";
			networkSeries.nodes.template.tooltipText = "{id}";
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
				event.target.outerCircle.disabled = true;
				event.target.dataItem.fixed = true;  
			});
			networkSeries.nodes.template.events.on("down", function(event) {
				event.target.dataItem.fixed = false;  
			});
      /*Sets the new x and y values*/
			networkSeries.nodes.template.events.on("dragged", function(event) {
				event.target.dataItem.fixed = false;  
				var id = event.target.dataItem.id - 1;
				this.chart.series.values[0].dataItems.values[id]._dataContext.x = event.target.dataItem.node.x; 
				this.chart.series.values[0].dataItems.values[id]._dataContext.y = event.target.dataItem.node.y;
			}, this);
      /*Sets visible the node outer circle to make it look different while dragging*/
			networkSeries.nodes.template.events.on("dragstart", function(event) {
				event.target.outerCircle.disabled = false;
				event.target.dataItem.fixed = false;  
			});
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
		Sends a request to get a specific classroom configuration by its _id property, then sets the classroomConfiguration property as the response 
		data.
		*/
    async getClassroomConfiguration(payload){
      await axios
      .get(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/classroom-configuration/' + payload)
      .then(response => {
				this.classroomConfiguration = response.data.classroomConfiguration;
      })
      .catch(error => {
        console.log(error.response);
      })
		},

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},

		/*
		@fvillarrealcespedes:
		Sends a request to update a specific classroom configuration by its _id property. First the height and width properties are taken from the 
		nodes chart HTML div, then sets the positions property by getting all nodes x and y properties from the nodes chart. Finally composes the 
		data object with the three mentioned properties, and the name, createdBy and participants propeties from the component data. 
		*/
		async updateConfiguration(payload){
			var height = this.$refs.chartdiv.clientHeight;
			var width = this.$refs.chartdiv.clientWidth;
			this.classroomConfiguration.positions = [];
			for(var i = 0; i < this.classroomConfiguration.participants; i++){
				this.classroomConfiguration.positions.push(
					[
						this.chart.series.values[0].dataItems.values[i].node.x,
						this.chart.series.values[0].dataItems.values[i].node.y,
					]
				);
			}			
			await axios
			.put(`${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}` + '/classroom-configuration/' + payload, {
				name: this.classroomConfiguration.name,
				createdBy: this.classroomConfiguration.createdBy,
				lastEditedBy: this.user.username,
				participants: this.classroomConfiguration.participants,
				positions: this.classroomConfiguration.positions,
				height: height,
				width: width
			})
			.then(response => {
				this.getClassroomConfigurations();
				this.dispatchNotification('classroomConfigurations.updateSuccess', 'check-circle', 5000, 'success');
				this.disposeChart();
				this.height = 0;
			})
      .catch(error => {
				console.log(error.response);
				this.dispatchNotification('classroomConfigurations.updateError', 'close-circle', 5000, 'error');
      })
		},

		dispatchNotification(text, icon, timeout, color){
			let notification = {
				show: true,
				icon: 'mdi-' + icon,
				text: 'notifications.' + text,
				timeout: timeout,
				color: color
			}
			console.log('notif', notification)
			this.$store.dispatch('showNotification', notification)
		}			
	},
	
	computed: {
		/*
		@fvillarrealcespedes:
		ClassroomConfigurationId for the UpdateClassroomConfiguration component, get method is imported from the store.
		*/    
    classroomConfigurationId: {
      get () {
        return this.$store.getters.getClassroomConfigurationId;
			}
		},
		user: {
      get () {
        return this.$store.getters.getUser;
      },
      set (payload) {
        this.$store.commit('setUser', payload);
      }
		}		
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the classroomConfigurationId property to get the specified classroom configuration immediately when changes.
		*/	    
		classroomConfigurationId: function(){
			this.getClassroomConfiguration(this.classroomConfigurationId);
		}
	}
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