<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6" class="text-center">
				<v-spacer :span="24" class="separator"></v-spacer>
				<h2>{{ $t('login.header') }}</h2>
				<v-form
					ref="loginForm"
					v-model="validLogin"	
				>
					<v-text-field
						v-model="username"
						label="Nombre de usuario"
						required
						:rules="requiredRules"
						:counter="20"
					></v-text-field>

					<v-text-field
						v-model="password"
						:append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
						:type="visible ? 'text' : 'password'"
						name="input-10-1"
						label="Contraseña"              
						@click:append="visible = !visible"
						:rules="requiredRules"
						:counter="20"
					></v-text-field>  	


					<v-btn
						color="success"
						class="mb-4 ms-4"
						@click="login()"
					>
					Ingresar
					<v-icon right>
						mdi-login
					</v-icon>
					</v-btn>
					<v-btn
						class="mb-4 ms-4 white--text"
						color="yellow darken-3"   
						@click="resetForm()"
					>
						Limpiar
					<v-icon right>
						mdi-eraser
					</v-icon>              
					</v-btn>

				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
/*Imports*/
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

export default {
	name: 'Login',

	data () {
		return {
			/*Component properties*/
			validLogin: true,
			username: '',
			password: '',
			visible: false,
			/*Arrays & Rules*/
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
		}
	},

	methods: {
		login(){
			let username = this.username;
			let password = this.password;
			let service = process.env.VUE_APP_SERVICE_NAME;
			let credentials = {
				username,
				password,
				service,
			};
			this.$store.dispatch('retrieveUser', credentials)
			.then(response => {
				this.$router.push('/');
			})
		},

		/*
		@fvillarrealcespedes:
		Reset the create metric form.
		*/		
		resetForm(){
			this.$refs.loginForm.reset();
		},

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
	}

}
</script>

<style scoped>
.separator{
	height: 50%;
}
</style>