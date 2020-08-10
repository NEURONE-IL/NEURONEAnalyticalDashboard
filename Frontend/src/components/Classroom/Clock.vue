<template>
	<v-container>
		<v-card>
			<v-row class="text-center">
				<v-col cols="4">
					<!-- Session init time -->
					<span>
						Hora de inicio: {{this.initTime}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Actual time -->
					<span>
						Hora actual: {{this.currentTime}}
					</span>
				</v-col>
				<v-col cols="4">
					<!-- Time in session -->
					<span>
						Tiempo de sesión: {{this.sessionTime}}
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
	name: 'Clock', 

	data(){
		return{
			/*Component properties*/
			initTime: '',
			currentTime: '',
			sessionTime: '',
			totalSeconds: 0
		}
	}, 

	/*
	@fvillarrealcespedes:
	Invoked whe the DOM is mounted and allows to access the reactive component. Calls the two methods to get the necessaries times. 
	*/
	mounted(){
		this.showInitTime();
		this.showCurrentTime();
	},

	methods:{
		/*
		@fvillarrealcespedes:
		Gets the session init time from store in milliseconds, gets the hours, minutes and seconds, then formates it to "hh:mm:ss" to 
		display. 
		*/
		showInitTime(){
			var initDate = new Date(this.$store.getters.getInitTime);
			var h = initDate.getHours(); 
			var m = initDate.getMinutes(); 
			var s = initDate.getSeconds(); 			
			/*Add a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			this.initTime = h + ":" + m + ":" + s + " ";
		},

		/*
		@fvillarrealcespedes:
		Gets the actual in milliseconds, gets the hours, minutes and seconds, then formates it to "hh:mm:ss" to display. Also calculates 
		the time in session comparing the session init time and the actual time, then formates it to "hh:mm:ss" to display. This method 
		is repeated every 1000 milliseconds to update the time in session. 
*/
		showCurrentTime(){
			var currentDate = new Date();
			var h = currentDate.getHours(); 
			var m = currentDate.getMinutes(); 
			var s = currentDate.getSeconds(); 			
			/*Add a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			this.currentTime = h + ":" + m + ":" + s + " ";
			/*Get the session init time*/
			var initDate = new Date(this.$store.getters.getInitTime);
			var dateDifference = Math.round((currentDate.getTime() - initDate.getTime())/1000);
			var sh = parseInt(dateDifference/3600);
			var sm = parseInt(dateDifference/60);
			var ss = parseInt(dateDifference%60);
			/*Add a zero before the value of hours, minutes and seconds in case this is under 10 to keep the format*/
			sh = (sh < 10) ? "0" + sh : sh;
			sm = (sm < 10) ? "0" + sm : sm;
			ss = (ss < 10) ? "0" + ss : ss;			
			this.sessionTime = sh + ":" + sm + ":" + ss + " ";
			/*Sets the repeat time in milliseconds*/
			setTimeout(this.showCurrentTime, 1000);
		},
	},
}
</script>



<style scoped>
.body {
  background: black;
}
.clock {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	
	font-size: 60px;
	
	letter-spacing: 7px;
}
</style>