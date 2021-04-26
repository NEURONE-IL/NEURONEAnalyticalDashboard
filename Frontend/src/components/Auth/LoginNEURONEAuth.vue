<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="6" class="text-center">
				<v-spacer :span="24" class="separator"></v-spacer>
				<v-card>
					<br>
					<h2>{{ $t('login.header') }}</h2>
					<!-- NEURONE-AD logo -->
					<v-row class="loginImg">
						<v-col cols="10">
							<v-img
								src="@/assets/neurone-authlogo.png"		
							>
							</v-img>
						</v-col>
					</v-row>
					<v-spacer :span="24" class="separator"></v-spacer>
					<!-- LogIn form -->
					<v-form
						ref="loginForm"
						v-model="validLogin"	
					>
						<v-row justify="center">
							<!-- Username property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="username"
									:label="$t('login.username')"	
									required
									:rules="requiredRules"
									:counter="20"
								>
								</v-text-field>
							</v-col>
							<!-- Password property input field -->
							<v-col cols="10">
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
							</v-col> 
							<v-col cols="12">
							<!-- LogIn button -->
								<v-btn
									color="success"
									class=" mt-8 mb-8 ms-4"
									@click="login()"
									:disabled="!validLogin"
								>
									{{ $t('buttons.signin') }}
									<v-icon right>
										mdi-login
									</v-icon>
								</v-btn>
								<!-- Clear button -->
								<v-btn
									class=" mt-8 mb-8 ms-4 white--text"
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
									class=" mt-8 mb-8 ms-4 white--text"
									color="#006666"   
									:href="setAuthLink()"
								>
									{{ $t('buttons.signup') }}
									<v-icon right>
										mdi-account-plus
									</v-icon>              
								</v-btn>
							</v-col>
						</v-row>
						<v-divider></v-divider>
						<!-- Go to NEURONE-AD authentication service button -->
						<v-btn
							class=" mt-8 mb-8 ms-4 white--text"
							color="primary"   
							@click="setValue(0)"
						>
							{{ $t('buttons.useAD') }}
							<v-icon right>
								mdi-account
							</v-icon>              
						</v-btn>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'LoginNEURONEAuth',

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
				service
			};
			this.$store.dispatch('retrieveUser', {
				urlService: `${process.env.VUE_APP_NEURONE_AUTH_BACK_API_URL}/api/credential/signin`,
				credentials: credentials
			})
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
		Returns the NEURONE-Auth frontend URL to redirect the user and allow them to sign up with its service.
		*/
		setAuthLink(){
			return process.env.VUE_APP_NEURONE_AUTH_FRONT_URL;
		},

		/*
		@fvillarrealcespedes:
		Sets the loginService property to display the selected authentication service form.
		*/
		setValue(value){
			this.loginService = value;
		}
	},

	computed: {
    /*
		@fvillarrealcespedes:
		LoginService property to check if user uses or not NEURONE-Auth, get and set methods are imported from store.
		*/	    
    loginService: {
      get () {
        return this.$store.getters.getLoginService;
      },
      set (payload) {
        this.$store.commit('setLoginService', payload);
      }
		}
	}
}
</script>

<style scoped>
.separator{
	height: 2%;
}
.loginImg{
	justify-content: center;
}
</style>