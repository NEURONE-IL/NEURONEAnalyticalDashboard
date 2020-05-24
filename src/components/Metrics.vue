<template>
	<v-container>
    <v-row no-gutters justify="center">
			<v-col 
				v-for="(metric, i) in metrics" :key="i"
				sm="4"
				xs="12"
			>
				<v-checkbox
					v-model="checkedMetrics"
					:label="metric"
					:value="metric"
				>
				</v-checkbox>
			</v-col>
		</v-row>
		
	</v-container>
	
</template>

<script>

export default {
	name: 'Metrics',
	
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
