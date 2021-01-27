<template>
  <v-container>
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
	name: 'LineChart',

	data (){
		return{
			/*Component properties*/
			chart: null,
			chartData: [],
			counter: 0,
			interval: 0,
			loading: null,
			max: 0,
		}
	},

	methods: {
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
		Disposes current line chart and sets to null lineChartUsername and lineChartSelectedMetric properties.
		*/
		disposeChart(){
			if(this.chart){
				this.chart.dispose();
				this.lineChartUsername = null;
				this.lineChartSelectedMetric = null;
			}
		},	

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, formates a query URL to match the backend format. Has three params, the URL string before the 
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
		A loop from the interval value to the maximum value minus the interval itself to get all the data objects from zero to the 
		changing value i, that is increment each time in the interval value.
		*/
		async getData(){
			for(var i=this.interval; i<=this.max-this.interval; i+=this.interval){
				this.getDataItem(0, i);
			}
		},

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
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/detail/${url}`)
			.then(response => {
				this.chartData.push({
					time: tf,
					value: response.data[0][this.lineChartSelectedMetric]
				})
			})
      .catch(error => {
        console.log(error.response);
      })
		},

		/*
		@fvillarrealcespedes:
		NEURONE-AM original method, gets the init stage time for a specific user, also sets the maximum time value and the necessary 
		data objects quantity to compose the line chart.
		*/
		async getInitTime(){
			this.loading = true;
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/initstage/${this.lineChartUsername}`)
			.then(response => {
				let actualTime = Date.now();
				let initTime = response.data.inittime;
				this.max = Math.round((actualTime - initTime)/1000);
				this.setCounter();
				this.getData();
			})
      .catch(error => {
        console.log(error.response);
      });
		},

		/*
		@fvillarrealcespedes:
		Searches in metrics array the metric object where name property equals the given name param, then returns that object alias.
		*/
    setAlias(name){
      var metric = this.metrics.find(metric => metric.name === name);
      return metric.alias;
    },

		/*
		@fvillarrealcespedes:
		Sets all line chart properties, from height to axes, among others.
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
			/*Creates data series for chart*/
			var series = this.chart.series.push(new am4charts.LineSeries());
			/*Sets datafields*/
			series.dataFields.valueY = "value";
			series.dataFields.valueX = "time";
			series.tooltipText = "{value}"
			series.strokeWidth = 2;
			series.minBulletDistance = 15;
			/*Sets series tooltip properties*/
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
			/*Creates a horizontal scrollbar with previe and place it underneath the time axis (just for tests)*/
			/*			
			this.chart.scrollbarX = new am4charts.XYChartScrollbar();
			this.chart.scrollbarX.series.push(series);
			this.chart.scrollbarX.parent = this.chart.bottomAxesContainer;
			*/
			/*Sets axis titles and their font properties*/
			valueAxis.title.text = this.setAlias(this.lineChartSelectedMetric);
			valueAxis.title.fontWeight = "bold";
			timeAxis.title.text = this.$t('charts.line.timeLabel');
			timeAxis.title.fontWeight = "bold";
			/*Sets export menu*/
			this.chart.exporting.menu = new am4core.ExportMenu();
			/*Sets title and its font properties*/
			let title = this.chart.titles.create();
			title.text = this.$t('charts.line.title') + this.lineChartUsername + this.$t('charts.line.titleConnector') + this.setAlias(this.lineChartSelectedMetric);
			title.fontWeight = "bold";
			title.fontSize = 25;
			title.marginBottom = 30;
			this.loading = false;
		},

		/*
		@fvillarrealcespedes:
		Using maximum time for a query and a interval value (in seconds, starting at 30) properties in a loop, calculates and sets the queries quantity 
		needed to get the required data for line chart. In case the queries value exceeds 100, interval value is increased in 10 and queries value is 
		recalculated.
		*/
		setCounter(){
			var queries = Math.trunc(this.max/this.interval) - 1;
			while(queries > 100){
				this.interval += 10;
				queries = Math.trunc(this.max/this.interval) - 1;
			}
			this.counter = queries;
		},		

		/*
		@fvillarrealcespedes:
		Helper method to wait for a given time in milliseconds.
		*/	
		sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches chartData array property, when this value equals the counter property sorts the chartData array by time property and finally sets the line chart.
		*/
    async chartDataLength (value, oldValue) {
      if(value === this.counter){
				await this.sleep(3000);
				function compare ( a, b ){ return a.time - b.time; };
				this.setChart(this.chartData.sort( compare ));
			}
    },

		/*
		@fvillarrealcespedes:
		Watches the lineChartUsername property to eventually update the line chart.
		*/			
		lineChartUsername: {
			immediate: true,

			handler: async function(){
				if(this.lineChartUsername){
					this.chartData = [];
					this.interval = 10;
					this.getInitTime();			
				}			
			}
		}
	},


	computed: {
		/*
		@fvillarrealcespedes:
		Helper method that gets the chartData array lenght.
		*/		
		chartDataLength() {
			return this.chartData.length;
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
.loading{
	width: 80%;
	margin-left: 10%;
}
</style>
