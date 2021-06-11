<template>
	<v-container>
		<v-card>
			<v-row class="text-center">
				<v-col cols="4">
					<!-- Session init time -->
					<span>
						{{ $t('chronometer.sessionInitTime') }}: {{this.sessionInitTimeString}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Actual time -->
					<span>
						{{ $t('chronometer.currentTime') }}: {{this.currentTime}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Session time -->
					<span>
						{{ $t('chronometer.sessionTime') }}: {{this.sessionTime}}
					</span>
				</v-col>
			</v-row>
		</v-card>
	</v-container>		
</template>

<script>
export default {
	name: 'Chronometer', 

	data(){
		return{
			/*Component properties*/
			currentTime: '',
			sessionInitTimeString: '',
			sessionTime: '',
			totalSeconds: 0
		}
	}, 

	/*
	@fvillarrealcespedes:
	Invoked when the DOM is mounted and allows to access the reactive component. Calls the two methods to get the necessaries times. 
	*/
	mounted(){
		this.showInitTime();
		this.showCurrentTime();
	},

	methods:{
		/*
		@fvillarrealcespedes:
		Gets the actual time in milliseconds, gets the hours, minutes and seconds, then formates it to "hh:mm:ss" to display. Also calculates 
		the session time comparing the session init time and the actual time, then formates it to "hh:mm:ss" to display. This method 
		is repeated every 1000 milliseconds to update the session time every second. 
		*/
		showCurrentTime(){
			var currentDate = new Date();
			var h = currentDate.getHours(); 
			var m = currentDate.getMinutes(); 
			var s = currentDate.getSeconds(); 			
			/*Puts a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			this.currentTime = h + ":" + m + ":" + s + " ";
			/*Gets the session init time and difference with current date*/
			var sessionInitDate = new Date(this.sessionInitTime);
			var dateDifference = Math.round((currentDate.getTime() - sessionInitDate.getTime())/1000);
			/*Gets the date difference hours, minutes and seconds. Respective division and module operations are apply*/
			var sh = parseInt((dateDifference/3600));
			var sm = parseInt((dateDifference/60)%60);
			var ss = parseInt(dateDifference%60);
			/*Puts a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			sh = (sh < 10) ? "0" + sh : sh;
			sm = (sm < 10) ? "0" + sm : sm;
			ss = (ss < 10) ? "0" + ss : ss;			
			this.sessionTime = sh + ":" + sm + ":" + ss + " ";
			/*Sets the repeat time in milliseconds*/
			setTimeout(this.showCurrentTime, 1000);
		},

		/*
		@fvillarrealcespedes:
		Gets the session init time from store in milliseconds, gets the hours, minutes and seconds, then formates it to "hh:mm:ss" to 
		display. 
		*/
		showInitTime(){
			var sessionInitDate = new Date(this.sessionInitTime);
			var h = sessionInitDate.getHours(); 
			var m = sessionInitDate.getMinutes(); 
			var s = sessionInitDate.getSeconds(); 			
			/*Add a zero before the value of hours, minutes or seconds in case any of this values is under 10 to keep the format*/
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			this.sessionInitTimeString = h + ":" + m + ":" + s + " ";
		}
	},

	computed: {
		/*
		@fvillarrealcespedes:
		SessionInitTime, get and set methods are imported from store.
		*/
		sessionInitTime: {
			get () {
				return this.$store.getters.getSessionInitTime;
			},
			set (payload) {
				this.$store.commit('setSessionInitTime', payload);
			}
		}
	},
	
	watch: {
		/*
		@fvillarrealcespedes:
		Watches the sessionInitTime property to calculate and display the three time values.
		*/				
		sessionInitTime: {
			immediate: true, 

			handler: function(){
				this.showInitTime();
				this.showCurrentTime();			
			}
		}
	}
}
</script>

<style scoped>
.body {
  background: black;
}
.chronometer {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	
	font-size: 60px;
	
	letter-spacing: 7px;
}
</style>