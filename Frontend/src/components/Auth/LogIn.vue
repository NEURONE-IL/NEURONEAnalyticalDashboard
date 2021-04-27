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
								src="@/assets/neurone-adlogo.png"		
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
									:href="'/signup'"
								>
									{{ $t('buttons.signUp') }}
									<v-icon right>
										mdi-account-plus
									</v-icon>              
								</v-btn>
							</v-col>
						</v-row>
						<v-divider></v-divider>
						<!-- Go to NEURONE-Auth authentication service button -->
						<v-btn
							class=" mt-8 mb-8 ms-4 white--text"
							color="primary"   
							@click="setValue(1)"
						>
							{{ $t('buttons.useAuth') }}
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
	name: 'LogIn',

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
		Tries to authenticate a user given their credentials. Composes a credentials object and sends it to store where the NEURONE-AD log in service 
		is called.
		*/		
		logIn(){
			let username = this.username;
			let password = this.password;
			let credentials = {
				username,
				password
			};
			this.$store.dispatch('retrieveUser', {
				urlService: `${process.env.VUE_APP_NEURONE_AD_BACKEND_API_URL}/auth/login`,
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