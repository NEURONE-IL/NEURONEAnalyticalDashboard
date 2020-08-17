<template>
  <v-container>
		<!-- Line chart -->
		<div class="lineChart" ref="chartdiv"></div>
  </v-container>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import { mapActions, mapState } from 'vuex';
/*
@fvillarrealcespedes:
Chart library imports.
*/
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from 'axios';

am4core.useTheme(am4themes_animated);

export default {
	name: 'LineChart',

	data (){
		return{
			/*Component properties*/
			chart: null,
			chartData: [],
			counter: 0,
			interval: 0,
			max: 0,
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Sends a request to get an user specific metric value, between ti and tf, both in seconds. Before the call, composes the query 
		URL based on the lineChartUsername, the lineChartSelectedMetric, ti and tf. Finally composes an object to match the line chart 
		data format and pushes it to the data set.
		*/
		async getDataItem(ti, tf){
			let url = `${this.lineChartUsername}?metrics=${this.lineChartSelectedMetric}&`;
			url = this.formatUrl(url, ti, tf);
			await axios
			.get(`${process.env.VUE_APP_API_URL}/detail/${url}`)
			.then(response => {
				this.chartData.push({
					time: tf,
					value: response.data[0][this.lineChartSelectedMetric]
				})
				console.log(tf, response.data[0][this.lineChartSelectedMetric]);
			})
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		A loop from the interval value to the maximum value minus the interval itself to get all the data objects from zero to the 
		changing value i, that is increment each time in the interval value.
		*/
		async getData(){
			for(var i=this.interval; i<=this.max-this.interval; i+=this.interval){
				this.getDataItem(0, i);
			}
			await this.sleep(3000);
			function compare ( a, b ){ return a.time - b.time; };
			this.setChart(this.chartData.sort( compare ));
			console.log(this.chartData.length)			
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, formates a query URL to match the backend format. Has three params, the URL string before the 
		format, ti and tf, both of this two last being numeric values to represent seconds. Three cases are contemplated, the init time 
		is zero, the tf param is the same as the maximum value, and a default one.
		*/
    formatUrl(url, ti, tf) {
			if(ti === 0){
				return url + `ti=${tf}`;
			}
			else if(tf === this.max){
				return url + `tf=${tf - ti}`;
			}
			else{
				return url + `ti=${ti}&tf=${this.max - tf}`;
			}
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, gets the init stage time for a specific user, also sets the maximum time value and the necessary 
		data objects quantity to compose the line chart.
		*/
		getInitTime(){
			axios
			.get(`${process.env.VUE_APP_API_URL}/initstage/${this.lineChartUsername}`)
			.then(response => {
				let actualTime = Date.now();
				let initTime = response.data.inittime;
				console.log(initTime, 'inittimeline')
				this.max = Math.round((actualTime - initTime)/1000);
				console.log(this.max + '/' + this.interval, 'div')
				this.counter = Math.trunc(this.max/this.interval);
				console.log(this.counter, 'counter')
				this.getData();
			})
      .catch(error => {
        console.log(error.response);
      });
		},

		/*
		@fvillarrealcespedes:
		Sets all line chart properties, from the height, to the axes among others.
		*/
		setChart(chartData){
			/*Chart creation*/
			this.chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
			this.chart.logo.height = -15000;			
			this.chart.data = chartData;
			/*Axes creation and minimum values definition*/
			var timeAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
			var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
			timeAxis.min = 0;
			valueAxis.min = 0;
			/*Creates the data series for the chart*/
			var series = this.chart.series.push(new am4charts.LineSeries());
			/*Sets the datafields*/
			series.dataFields.valueY = "value";
			series.dataFields.valueX = "time";
			series.tooltipText = "{value}"
			series.strokeWidth = 2;
			series.minBulletDistance = 15;
			/*Sets the series tooltip properties*/
			series.tooltip.background.cornerRadius = 20;
			series.tooltip.background.strokeOpacity = 0;
			series.tooltip.pointerOrientation = "vertical";
			series.tooltip.label.minWidth = 40;
			series.tooltip.label.minHeight = 40;
			series.tooltip.label.textAlign = "middle";
			series.tooltip.label.textValign = "middle";
			/*Makes bullets grow on hover*/
			var bullet = series.bullets.push(new am4charts.CircleBullet());
			bullet.circle.strokeWidth = 2;
			bullet.circle.radius = 4;
			bullet.circle.fill = am4core.color("#fff");
			var bullethover = bullet.states.create("hover");
			bullethover.properties.scale = 1.3;
			/*Creates a panning cursor*/
			this.chart.cursor = new am4charts.XYCursor();
			this.chart.cursor.behavior = "panXY";
			this.chart.cursor.xAxis = timeAxis;
			this.chart.cursor.snapToSeries = series;
			/*Creates a horizontal scrollbar with previe and place it underneath the time axis*/
			this.chart.scrollbarX = new am4charts.XYChartScrollbar();
			this.chart.scrollbarX.series.push(series);
			this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;

			this.chart.exporting.menu = new am4core.ExportMenu();
		},

		/*
		@fvillarrealcespedes:
		Disposes the current node chart.
		*/
		disposeChart(){
			if(this.chart){
				this.chart.dispose();
				this.lineChartUsername = null;
				this.lineChartSelectedMetric = null;
			}
		},		

		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the lineChartUsername property to eventually update the line chart.
		*/			
		lineChartUsername: {
			immediate: true,

			handler: async function(){
				if(this.lineChartUsername){
					this.chartData = [];
					this.interval = 30;
					this.getInitTime();			
/*					this.getData();	
					await this.sleep(3000);
					function compare ( a, b ){ return a.time - b.time; };
					this.setChart(this.chartData.sort( compare ));					*/
				}			
			}
		}
	},


	computed: {
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
    }
	}
}
</script>

<style scoped>
.lineChart {
  width: 100%;
	height: 450px;
}
.amcharts-amexport-item {
  border: 2px solid #777;
}
.amcharts-amexport-top .amcharts-amexport-item > .amcharts-amexport-menu {
  top: -3px!important;
  left: 2px!important;
}
</style>