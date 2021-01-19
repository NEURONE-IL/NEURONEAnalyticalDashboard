<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('metricsDisplay.header') }}</h2>
				<v-divider></v-divider>	
				<br>	
				<v-card>
					<v-card-title>
					<v-spacer></v-spacer>
					<!-- Data table search imput field -->
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						:label="$t('labels.tableSearch')"
						single-line
						hide-details
					></v-text-field>
					</v-card-title>
					<!-- Data table to display all metrics -->
					<v-data-table
						:headers="headers"
						:items="metrics"
						item-key="name"
						:search="search"
					>
					</v-data-table>
				</v-card>
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
import { mapState } from 'vuex';

export default {
	name: 'MetricsDisplay',

	data (){
		return {
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('metricsDisplay.tableHeaders.metric'), value: 'alias', width: '17%' },
				{ text: this.$t('metricsDisplay.tableHeaders.description'), value: this.setDescription(), width: '83%' }
			]
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Sets metrics descriptions depending on i18n locale property.
		*/			
		setDescription(){
			var description;
			description = 'descriptions.' + this.$i18n.locale.split('-')[0];
			return description;
		}
	},

	computed:{
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
.theme--light.v-divider {
  border-color: rgba(33,150,243,0.5) !important; 
}
.expandedItem {
	background-color: rgba(33,150,243,0.3) !important;
}
</style>