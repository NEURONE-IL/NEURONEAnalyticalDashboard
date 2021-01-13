<template>
	<v-container>
		<v-card>
			<v-row class="text-center">
				<v-col cols="4">
					<!-- Session init time -->
					<span>
						{{ $t('timer.initTime') }}: {{this.sessionInitTime}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Actual time -->
					<span>
						{{ $t('timer.currentTime') }}: {{this.currentTime}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Session time -->
					<span>
						{{ $t('timer.sessionTime') }}: {{this.sessionTime}}
					</span>
				</v-col>
			</v-row>
		</v-card>
	</v-container>		
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import { mapState } from 'vuex';

export default {
	name: 'Timer', 

	data(){
		return{
			/*Component properties*/
			currentTime: '',
			sessionInitTime: '',
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
		the time in session comparing the session init time and the actual time, then formates it to "hh:mm:ss" to display. This method 
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
			/*Gets the session init time and difference with crrent date*/
			var initDate = new Date(this.initTime);
			var dateDifference = Math.round((currentDate.getTime() - initDate.getTime())/1000);
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
			var initDate = new Date(this.initTime);
			var h = initDate.getHours(); 
			var m = initDate.getMinutes(); 
			var s = initDate.getSeconds(); 			
			/*Add a zero before the value of hours, minutes or seconds in case any of this values is under 10 to keep the format*/
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			this.sessionInitTime = h + ":" + m + ":" + s + " ";
		}
	},

	computed: {
		/*
		@fvillarrealcespedes:
		Session init time, get and set methods are imported from store.
		*/		
		initTime: {
			get () {
				return this.$store.getters.getInitTime;
			},
			set (payload) {
				this.$store.commit('setInitTime', payload);
			},
		}
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the session init time property to calculate and display the three time values.
		*/				
		initTime: {
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
.timer {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	
	font-size: 60px;
	
	letter-spacing: 7px;
}
</style>