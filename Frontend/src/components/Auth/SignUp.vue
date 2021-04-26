<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" md="6" class="text-center">
				<v-spacer :span="24" class="separator"></v-spacer>
				<v-card>
					<br>
					<h2>{{ $t('signup.header') }}</h2>
					<!-- NEURONE-AD logo -->
					<v-row class="signupImg">
						<v-col cols="10">
							<v-img
								src="@/assets/neurone-adlogo.png"
								max-width="60%"
								max-height="100%"
							>
							</v-img>
						</v-col>
					</v-row>
					<v-spacer :span="24" class="separator"></v-spacer>
					<!-- SignUp form -->
					<v-form
						ref="signupForm"
						v-model="validSignup"	
					>
						<v-row justify="center">
							<!-- Username property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="username"
									:label="$t('signup.username')"	
									required
									:rules="requiredLengthRules"
									:counter="20"
								>
								</v-text-field>
							</v-col>
							<!-- Email property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="email"
									:label="$t('signup.email')"	
									required
									:rules="emailRules"
									:counter="40"
								>
								</v-text-field>
							</v-col>
							<!-- Password property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="password"
									:append-icon="visiblePassword ? 'mdi-eye' : 'mdi-eye-off'"
									:type="visiblePassword ? 'text' : 'password'"
									name="input-10-1"
									:label="$t('signup.password')"           
									@click:append="visiblePassword = !visiblePassword"
									:rules="passwordRules"
									:counter="20"
								>
								</v-text-field>
							</v-col> 
							<!-- Password confirmation property input field -->
							<v-col cols="10">
								<v-text-field
									v-model="passwordConfirmation"
									:append-icon="visiblePasswordValidation ? 'mdi-eye' : 'mdi-eye-off'"
									:type="visiblePasswordValidation ? 'text' : 'password'"
									name="input-10-1"
									:label="$t('signup.passwordConfirmation')"           
									@click:append="visiblePasswordValidation = !visiblePasswordValidation"
									:rules="passwordValidationRules"
									:counter="20"
								>
								</v-text-field>
							</v-col> 
							<!-- SignUp button -->
							<v-btn
								color="success"
								class=" mt-8 mb-8 ms-4"
								@click="signup()"
								:disabled="!validSignup"
							>
								{{ $t('buttons.createUser') }}
								<v-icon right>
									mdi-check
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
								:href="'/'"
							>
								{{ $t('buttons.goLogin') }}
								<v-icon right>
									mdi-login
								</v-icon>              
							</v-btn>
						</v-row>
						<v-divider></v-divider>
					</v-form>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: 'Login',

	data () {
		return {
			/*Component properties*/
			email: '',
			password: '',
			passwordConfirmation: '',
			roles: ['user'],
			username: '',
			validSignup: true,
			visiblePassword: false,
			visiblePasswordValidation: false,
			/*Rules*/
			requiredLengthRules: [
				v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule'),
				v => (v && v.length < 21) || this.$t('rules.maxLength20'),
				v => (v && v.length > 4) || this.$t('rules.minLength5')
			],
			passwordRules: [
				v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule'),
				v => (v && v.length < 21) || this.$t('rules.maxLength20'),
				v => (v && v.length > 7) || this.$t('rules.minLength8')
			],
			passwordValidationRules: [
				v => !!v || this.$t('rules.requiredRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule'),
				v => (v && v.length < 21) || this.$t('rules.maxLength20'),
				v => (v && v.length > 7) || this.$t('rules.minLength8'),
				v => (v && v === this.password) || this.$t('rules.passwordMatch')
			],			
      emailRules: [
        v => !!v || this.$t('rules.requiredRule'),
        v => /.+@.+\..+/.test(v) || this.$t('rules.emailRule'),
				v => (v && (/\S/.test(v))) || this.$t('rules.spacesRule'),
				v => (v && v.length < 41) || this.$t('rules.maxLength40'),
				v => (v && v.length > 4) || this.$t('rules.minLength5')				
      ]
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
		signUp(){
			let username = this.username;
			let email = this.email;
			let password = this.password;
			let roles = this.roles;
			let user = {
				username,
				email,
				password,
				roles,
			};
			this.$store.dispatch('createUser', user)
			.then(response => {
				this.$router.replace('/login');
			})
		},

		/*
		@fvillarrealcespedes:
		Reset the create login form.
		*/		
		resetForm(){
			this.$refs.signupForm.reset();
		}
	}
}
</script>

<style scoped>
.separator{
	height: 2%;
}
.signupImg{
	justify-content: center;
	margin-left: 20%;
}
</style>