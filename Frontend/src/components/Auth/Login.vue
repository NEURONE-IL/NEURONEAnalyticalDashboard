<template>
	<v-container>
		<v-row>
			<v-col cols="12" md="6" offset="3" class="text-center">
				<v-spacer :span="24" class="separator"></v-spacer>
				<h2>{{ $t('login.header') }}</h2>
				<v-row class="loginImg">
					<v-img
						src="@/assets/neurone-adlogo.png"
						max-height="60%"
						max-width="60%"					
					>
					</v-img>
				</v-row>
				<v-spacer :span="24" class="separator"></v-spacer>
				<!-- LogIn form -->
				<v-form
					ref="loginForm"
					v-model="validLogin"	
				>
					<!-- Username property input field -->
					<v-text-field
						v-model="username"
						:label="$t('login.username')"	
						required
						:rules="requiredRules"
						:counter="20"
					>
					</v-text-field>
					<!-- Password property input field -->
					<v-text-field
						v-model="password"
						:append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
						:type="visible ? 'text' : 'password'"
						name="input-10-1"
						:label="$t('login.password')"           
						@click:append="visible = !visible"
						:rules="requiredRules"
						:counter="20"
					>
					</v-text-field> 
					<!-- SignIn button -->
					<v-btn
						color="success"
						class="mb-4 ms-4"
						@click="login()"
					>
						{{ $t('login.signin') }}
						<v-icon right>
							mdi-login
						</v-icon>
					</v-btn>
					<!-- Clear button -->
					<v-btn
						class="mb-4 ms-4 white--text"
						color="yellow darken-3"   
						@click="resetForm()"
					>
						{{ $t('buttons.clear') }}
						<v-icon right>
							mdi-eraser
						</v-icon>              
					</v-btn>
					<!-- SignUp button -->
					<v-btn
						class="mb-4 ms-4 white--text"
						color="#006666"   
						:href="setAuthLink()"
					>
						{{ $t('login.signup') }}
						<v-icon right>
							mdi-account-plus
						</v-icon>              
					</v-btn>
				</v-form>
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
import { mapActions, mapState } from 'vuex';

export default {
	name: 'Login',

	data () {
		return {
			/*Component properties*/
			password: '',
			username: '',
			validLogin: true,
			visible: false,
			/*Rules*/
			requiredRules: [
        v => !!v || this.$t('rules.requiredRule')
			],
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
		Trys to authenticate the given credentials. Composes a credentials object and sends it to store where the NEURONE-AUTH login service 
		is called.
		*/		
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
				this.$router.replace('/settings');
			})
		},

		/*
		@fvillarrealcespedes:
		Reset the create login form.
		*/		
		resetForm(){
			this.$refs.loginForm.reset();
		},

		/*
		@fvillarrealcespedes:
		Composes the NEURONE-AUTH frontend URL to redirect the user and allow them to sign up.
		*/
		setAuthLink(){
			return 'http://' + process.env.VUE_APP_HOST + ':' + process.env.VUE_APP_NEURONE_AUTH_FRONT;
		}	
	}

}
</script>

<style scoped>
.separator{
	height: 10%;
}
.loginImg{
	justify-content: center;
}
</style>