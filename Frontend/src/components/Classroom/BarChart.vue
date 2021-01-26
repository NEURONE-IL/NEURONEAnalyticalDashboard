<template>
  <v-container>
		<v-row class="ms-8">
			<v-col cols="3">
				<!-- Metric selector -->
				<v-select
					v-model="metric"
					:items="sortMetrics()"
					item-text="alias"
					item-value="name"
					:label="$t('performance.metric')"				
				>
				</v-select>
			</v-col>
			<v-col cols="3">
				<!-- Alert option selector (higher or lower than) -->
				<v-select
					v-model="option"
					:items="alertOptions"
					:label="$t('performance.successful')"
					item-text="text"
					item-value="value"
					required
					:rules="selectRules"									
				>
				</v-select>				
			</v-col>
			<v-col cols="3">
				<!-- Limit value input -->
				<v-text-field
					v-model="limit"
					:label="$t('performance.limit')"
					min="0"								
					type="number"
					step="0.01"
				>
				</v-text-field>
			</v-col>
			<v-col cols="3" class="text-center">
				<!-- Bar chart displayer button -->
				<v-btn
					color="success"
					:disabled="!metric "
					@click="getData()"
				>
					{{ $t('buttons.charts.update') }}
					<v-icon right>
						mdi-check
					</v-icon>
				</v-btn>
			</v-col>					
		</v-row>		
		<!-- Bar chart -->
		<div class="barChart" ref="chartdiv"></div>
  </v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import { mapActions, mapState } from 'vuex';
import axios from 'axios';
/*
@fvillarrealcespedes:
Chart library imports.
*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
	name: 'BarChart',

	data (){
		return{
			/*Component properties*/
			chart: null,
			chartData: null,
			limit: 0,
			metric: '',
			metricAlias: '',
			option : '',
			/*Arrays*/			
			alertOptions: [
				{value: 1, text: this.$t('settings.alertOptions.higher')},
				{value: 2, text: this.$t('settings.alertOptions.lower')},
			],
			/*Rules*/
			selectRules: [
        v => (v && v != null) || this.$t('rules.selectRule')
			],			
		}
	},

	mounted(){
		this.initChart();
	},

	methods: {

		initChart(){
			this.metric = this.settings.principal;
			this.setAlias(this.metric);
			this.getData();
			this.setOption();
			this.setLimit();
			this.disposeChart();
			this.getData();			
		},

		setOption(){
			var option = Number(this.settings.option);
			switch(option){
				case 1:
					this.option = this.alertOptions[0];
				case 2:
					this.option = this.alertOptions[1];
				default:
					this.option = this.alertOptions[0];
			}
		},

		setLimit(){
			var limit = Number(this.settings.limit);
			if(limit){
				this.limit = limit;
			}else{
				this.metrics.forEach(metric => {
					if(metric.name === this.metric){
						this.limit = metric.limit/2;
					}
				})
			}
			if(!this.limit){
				this.limit = 1;
			}
		},

		/*
		@fvillarrealcespedes:
		Formates the data from NEURONE-AM Connector component to match the chart format. The final dataset depends on option and limit properties 
		selected by the user and its composed by three sub datasets: one for values over the limit property, one for values that equals the limit and 
		one for values under the limit. Finally calls setChart method.*/
		composeData(chartData){
			var overLimit = 0;
			var onLimit = 0;
			var underLimit = 0;
			/*Checks the option property to assign a representative color for each sub dataset. If option equals 1, assigns red color for values under the 
			limit property, orange for values that equals the limit and green for values over the limit*/
			if(this.option === 1){
				chartData.forEach(element => {
					if(element[this.metric] > this.limit){
						overLimit++;
					}
					else if(element[this.metric] == this.limit){
						onLimit++;
					}
					else{
						underLimit++;
					}
					/*Composes the final dataset*/
					this.chartData = [
						{
							"category": this.$t('charts.bar.underLimit'),
							"participants": underLimit,
							"color": '#F44336'
						}, {
							"category": this.$t('charts.bar.onLimit'),
							"participants": onLimit,
							"color": '#FF9800'
						}, {
							"category": this.$t('charts.bar.overLimit'),
							"participants": overLimit,
							"color": '#4CAF50'
						}
					]				
				})
			}
			/*If option equals 2, assigns green color for values under the limit property, orange for values that equals the limit and red for values over the limit*/
			else{
				chartData.forEach(element => {
					if(element[this.metric] > this.limit){
						overLimit++;
					}
					else if(element[this.metric] == this.limit){
						onLimit++;
					}
					else{
						underLimit++;
					}
					/*Composes the final dataset*/					
					this.chartData = [
						{
							"category": this.$t('charts.bar.underLimit'),
							"participants": underLimit,
							"color": '#4CAF50'
						},
						{
							"category": this.$t('charts.bar.onLimit'),
							"participants": onLimit,
							"color": '#FF9800'
						},						
						{
							"category": this.$t('charts.bar.overLimit'),
							"participants": overLimit,
							"color": '#F44336'
						}
					]
				})
			}
			/*Calls setChart method*/
			this.setChart(this.chartData);
		},

		/*
		@fvillarrealcespedes:
		Disposes current bar chart.
		*/
		disposeChart(){
			if(this.chart){
				this.chart.dispose();
			}
		},

		/*
		@fvillarrealcespedes:
		Gets the performace value in a specific metric for all students from NEURONE-AM Connector component.
		*/		
		async getData(){
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_CONNECTOR_API_URL}/${this.metric}`)
			.then(response => {
				var chartData = response.data;
				this.composeData(chartData);
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		/*
		@fvillarrealcespedes:
		Searches in the metrics array the metric object where the name equals the given name param, then assigns that object alias to metricAlias property.
		*/
		setAlias(metric){
			let metrics = [...this.metrics];
			metrics.forEach(element => {
				if(element.name === metric){
					this.metricAlias = element.alias;
				}
			})
		},

		/*
		@fvillarrealcespedes:
		Sets all bar chart properties, from height to bars and available events.
		*/
		setChart(chartData){
			/*Chart creation*/
			this.chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
			this.chart.logo.height = -15000;	
			/*Sets series data and datafields*/
			this.chart.data = chartData;
			/*Creates category axis*/
			var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			/*Creates value axis*/
			var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
			var series = this.chart.series.push(new am4charts.ColumnSeries());
			/*Sets datafields*/
			series.dataFields.valueY = "participants";
			series.dataFields.categoryX = "category";
			series.name = "Performance";
			series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
			series.columns.template.fillOpacity = .8;
			series.columns.template.width = am4core.percent(50);
			/*Sets labels and its font height*/
			categoryAxis.title.text = "Desempeño respecto al límite";
			categoryAxis.title.fontWeight = "bold";
			valueAxis.title.text = "Participantes";
			valueAxis.title.fontWeight = "bold";
			valueAxis.min = 0;
			/*Sets columns colors*/
			series.columns.template.adapter.add("fill", function(fill, target) {
				return am4core.color(target.dataItem.dataContext.color);
			});
			series.columns.template.adapter.add("stroke", function(stroke, target) {
				return am4core.color(target.dataItem.dataContext.color);
			});
			/*Sets export menu*/
			this.chart.exporting.menu = new am4core.ExportMenu();
			/*Sets title and colums properties*/
			let title = this.chart.titles.create();
			title.text = this.$t('charts.bar.title') + this.metricAlias;
			title.fontSize = 25;
			title.marginBottom = 30;
			var columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
		},

		/*
		@fvillarrealcespedes:
		Sorts the array metrics elements alphabetically by their alias.
		*/		
		sortMetrics(){
			let metrics = [...this.metrics];
			function compare ( a, b ){ return a.alias > b.alias ? 1 : -1; };
			return metrics.sort( compare );
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the metric property to trigger the setAlias method. 
		*/			
		metric: function(){
			this.setAlias(this.metric);
		},

		showBarChart: function(){
			if(this.showBarChart){
				this.initChart();
			}
		}
	},

	computed: {
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
		Object that includes all sessionsettings, get and set methods are imported from store.
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
		}		
	}
}
</script>

<style scoped>
.barChart {
  width: 100%;
	height: 375px;
}
</style>
