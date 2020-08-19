<template>
	<v-select
		v-model="$i18n.locale"
		:items="$i18n.availableLocales"
	>
		<template v-slot:item="{ item }">
			<country-flag :country="getCode(item)" rounded/>
			<span>
				{{ item.toUpperCase() }}
			</span>
		</template>
		<template v-slot:selection="{ item }">
			<country-flag :country="getCode(item)" rounded/>
			<span>
				{{ item.toUpperCase() }}
			</span>
		</template>
	</v-select>
</template>

<script>
export default {
	data () {
		return{
			//
		}
	},

	methods: {
		getCode(country) {
			return country === 'en' ? 'us' : country === 'da' ? 'dk' : country;
		}
	}
}
</script>

<style>

</style>