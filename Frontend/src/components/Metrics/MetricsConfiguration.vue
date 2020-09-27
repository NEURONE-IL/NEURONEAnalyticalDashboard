<template>
	<v-container>
    <v-row no-gutters>
      <v-col cols="12" class="text-center">
				<h2>{{ $t('metricsConfiguration.header') }}</h2>
				<v-divider></v-divider>	
				<br>	
				<v-card>
					<v-card-title>
					<v-spacer></v-spacer>
					<v-text-field
						v-model="search"
						append-icon="mdi-magnify"
						:label="$t('labels.tableSearch')"
						single-line
						hide-details
					></v-text-field>
					</v-card-title>
					<!-- Display all metrics -->
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
	name: 'MetricsConfiguration',

	data (){
		return {
			/*Data table properties*/
			search: '',
			headers: [
				{ text: this.$t('metricsConfiguration.tableHeaders.metric'), value: 'alias', width: '17%' },
				{ text: this.$t('metricsConfiguration.tableHeaders.description'), value: this.setDescription(), width: '83%' }
			]
		}
	},

	methods: {
		setDescription(){
			var header;
			header = 'descriptions.' + this.$i18n.locale.split('-')[0];
			console.log(header);
			return header;
		}
	},

	computed:{
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