<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="6" class="text-center">
				<v-spacer :span="24" class="separator"></v-spacer>
				<v-card>
					<br>
					<h2>{{ $t('logIn.header') }}</h2>
					<!-- NEURONE-AD logo -->
					<v-row class="logInImg">
						<v-col cols="10">
							<v-img
								src="@/assets/neurone-authlogo.png"		
							>
							</v-img>
						</v-col>
					</v-row>
					<v-spacer :span="24" class="separator"></v-spacer>
					<!-- Log in form -->
					<v-form
						ref="logInForm"
						v-model="validLogIn"	
					>
						<v-row justify="center">
							<!-- Username property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="username"
									:label="$t('logIn.username')"	
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
									:label="$t('logIn.password')"           
									@click:append="visible = !visible"
									:rules="requiredRules"
									:counter="20"
								>
								</v-text-field>
							</v-col> 
							<v-col cols="12">
							<!-- Log in button -->
								<v-btn
									color="success"
									class=" mt-8 mb-8 ms-4"
									@click="logIn()"
								>
									{{ $t('buttons.signIn') }}
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
								<!-- Sign up button -->
								<v-btn
									class=" mt-8 mb-8 ms-4 white--text"
									color="#006666"   
									:href="setAuthLink()"
								>
									{{ $t('buttons.signUp') }}
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
	name: 'LogInNEURONEAuth',

	data () {
		return {
			/*Component properties*/
			password: '',
			username: '',
			validLogIn: true,
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
		Tries to authenticate a user given their credentials. Composes a credentials object and sends it to store where the NEURONE-AUTH log in service 
		is called.
		*/
		logIn(){
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
			.then(() => {
				this.$router.replace('/settings');
			})
		},

		/*
		@fvillarrealcespedes:
		Reset the log in form.
		*/		
		resetForm(){
			this.$refs.logInForm.reset();
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
		Sets the logInService property to display the selected authentication service form.
		*/
		setValue(value){
			this.logInService = value;
		}
	},

	computed: {
    /*
		@fvillarrealcespedes:
		LogInService property to check if user uses or not NEURONE-Auth, get and set methods are imported from store.
		*/	    
    logInService: {
      get () {
        return this.$store.getters.getLogInService;
      },
      set (payload) {
        this.$store.commit('setLogInService', payload);
      }
		}
	}	
}
</script>

<style scoped>
.separator{
	height: 2%;
}
.logInImg{
	justify-content: center;
}
</style>