<template>
  <v-container>
		<v-row class="ms-8">
			<v-col cols="3">
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
				<v-btn
					color="success"
					:disabled="!metric "
					@click="getData()"
				>
					{{ $t('buttons.charts.generate') }}
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
			metric: '',
			metricAlias: '',
			limit: 0,
			option : '',
			alertOptions: [
				{value: 1, text: this.$t('settings.alertOptions.higher')},
				{value: 2, text: this.$t('settings.alertOptions.lower')},
			],
			selectRules: [
        v => (v && v != null) || this.$t('rules.selectRule')
			],			
		}
	},

	mounted(){
		//this.sortMetrics();
		//this.setChart();
	},

	methods: {

		async getData(){
			console.log('ininin')
			console.log(this.metric, 'here')
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_CONNECTOR_API_URL}/${this.metric}`)
			.then(response => {
				var chartData = response.data;
				console.log(chartData);
				this.composeData(chartData);
			})
			.catch(error => {
				console.log(error.response);
			})
		},

		composeData(chartData){
			var overLimit = 0;
			var onLimit = 0;
			var underLimit = 0;

			//console.log(this.option, 'option')
			if(this.option === 1){
				
				chartData.forEach(element => {
					console.log(element[this.metric])
					if(element[this.metric] > this.limit){
						overLimit++;
						console.log('over', overLimit)
						console.log('this')
					}
					else if(element[this.metric] == this.limit){
						onLimit++;
					}
					else{
						underLimit++;
					}
					this.chartData = [
						{
							"category": this.$t('charts.bars.underLimit'),
							"participants": underLimit,
							"color": '#F44336'
						}, {
							"category": this.$t('charts.bars.onLimit'),
							"participants": onLimit,
							"color": '#FF9800'
						}, {
							"category": this.$t('charts.bars.overLimit'),
							"participants": overLimit,
							"color": '#4CAF50'
						}
					]				
				})
			}else{
				chartData.forEach(element => {
					console.log(element[this.metric])
					if(element[this.metric] > this.limit){
						overLimit++;
						console.log('over', overLimit)
						console.log('this')
					}
					else if(element[this.metric] == this.limit){
						onLimit++;
					}
					else{
						underLimit++;
					}
				this.chartData = [
					{
						"category": this.$t('charts.bars.underLimit'),
						"participants": underLimit,
						"color": '#4CAF50'
					},					
					{
						"category": this.$t('charts.bars.overLimit'),
						"participants": overLimit,
						"color": '#F44336'
					}, 
					{
						"category": this.$t('charts.bars.onLimit'),
						"participants": onLimit,
						"color": '#FF9800'
					}
				]
			})
			}
			console.log(this.chartData, 'proce')
			this.setChart(this.chartData);
		},

		setChart(chartData){

			this.chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

			// Add data
			this.chart.data = chartData;

			// Create axes

			var categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			

/*
			categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
				if (target.dataItem && target.dataItem.index & 2 == 2) {
//					return dy + 25;
				}
				return dy;
			});


			*/

			var valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

			// Create series
			var series = this.chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "participants";
			series.dataFields.categoryX = "category";
			series.name = "Performance";
			series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
			series.columns.template.fillOpacity = .8;
			series.columns.template.width = am4core.percent(50);


			categoryAxis.title.text = "Desempeño respecto al límite";
			categoryAxis.title.fontWeight = "bold";

			valueAxis.title.text = "Participants";
			valueAxis.title.fontWeight = "bold";

			valueAxis.min = 0;

			series.columns.template.adapter.add("fill", function(fill, target) {
				return am4core.color(target.dataItem.dataContext.color);
			});

			series.columns.template.adapter.add("stroke", function(stroke, target) {
				return am4core.color(target.dataItem.dataContext.color);
			});

			this.chart.exporting.menu = new am4core.ExportMenu();

			let title = this.chart.titles.create();
			title.text = this.$t('charts.bars.title') + this.metricAlias;
			title.fontSize = 25;
			title.marginBottom = 30;


			var columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
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

		setAlias(metric){
			console.log(metric, 'entra')
			let metrics = [...this.metrics];
			console.log(metrics, 'metrics')
			metrics.forEach(element => {
				console.log(element.name)
				if(element.name == metric){
					console.log(element.alias)
					this.metricAlias = element.alias;
				}
			})
		},

		sortMetrics(){
			let metrics = [...this.metrics];
			console.log(metrics)
			function compare ( a, b ){ return a.alias > b.alias ? 1 : -1; };
			return metrics.sort( compare );
		}
	},

	watch: {
		metric: function(){
			this.setAlias(this.metric);
		}
	},

	computed: {
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
.barChart {
  width: 100%;
	height: 375px;
}
</style>