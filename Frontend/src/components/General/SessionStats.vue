<template>
  <v-container>
		<!-- Button to go to session configuration view -->		
		<v-btn
			class="ma-4"
			color="error"
			@click="newSession()"
		>
			Nueva sesión	
			<v-icon right>
				mdi-new-box
			</v-icon>
		</v-btn>
  </v-container>
</template>

<script>
export default {
	name: 'SessionStats',
	
	data () {
		return{
			//
		}
	},

	methods: {
		/*
		@fvillarrealcespedes:
		Redirects to session configuration view. 
		*/
		newSession(){
			this.$router.push('/');
		}
	}
}
</script>

<style>
	/**/
</style>