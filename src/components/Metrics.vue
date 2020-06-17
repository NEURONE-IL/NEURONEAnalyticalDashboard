<template>
	<v-container>
		<h3 class="title">Seleccione la(s) métrica(s) a evaluar:</h3>
    <v-row no-gutters justify="center">
			<v-col 
				v-for="(metric, i) in metrics" :key="i"
				:sm="colsSize"
				xs="12"
			>
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
	
	props: {
		colsSize: Number
	},

	data (){
		return {
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
		updateSelectedMetrics(){
			this.$emit("updateFunction", this.checkedMetrics);
		}
	},

	watch: {
		checkedMetrics: function(){
			this.updateSelectedMetrics();
		}
	}
}
</script>

<style>
.title{
	text-align: left;
}
</style>