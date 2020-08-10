<template>
	<v-container>
		<h3 class="title">Seleccione la(s) métrica(s) a evaluar:</h3>
    <v-row no-gutters justify="center">
			<!-- V-for loop to display all availables metric --> 
			<v-col 
				v-for="(metric, i) in metrics" :key="i"
				sm="4"
				xs="12"
			>
				<!-- For each metric sets a switchable field to add the metric or remove from the checkedMetrics array -->
				<v-switch
					v-model="checkedMetrics"
					:label="metric"
					:value="metric"
				>
				</v-switch>
			</v-col>
		</v-row>
	</v-container>
	
</template>

<script>

export default {
	name: 'Metrics',

	data (){
		return {
			/*Component properties*/
			metrics: [
				"activebm",
				"bmrelevant",
				"ceffectivenes",
				"entropy",
				"f1",
				"modquery",
				"numqueries",
				"pagestay",
				"precision",
				"qeffectiveness",
				"recall",
				"score",
				"totalcover",
				"usfcover",
				"writingtime"
			],
			checkedMetrics: []
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		NEURONE-AM original function, emit function to update the selected metrics. 
		*/
		updateSelectedMetrics(){
			this.$emit("updateFunction", this.checkedMetrics);
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		NEURONE-AM original, controls the metric selection. 
		*/		
		checkedMetrics: function(){
			this.updateSelectedMetrics();
		}
	}
}
</script>

<style scoped>
.title{
	text-align: left;
}
</style>