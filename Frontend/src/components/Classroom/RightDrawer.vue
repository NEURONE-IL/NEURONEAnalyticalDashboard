<template>
  <!-- Navigation Drawer -->
	<v-navigation-drawer
		v-model="rightDrawer"
		:mini-variant.sync="miniVariant"
    disable-route-watcher
    mobile-breakpoint="960"
		app
		dark	
		right
		color="primary"
	>
    <!-- List to display node chart selected participants and all their metrics search results -->
		<v-list
			dense
			expand
      dark
			class="py-0"
		>
      <!-- First list item, just header with the drawer title -->
			<v-list-item>
        <v-list-item-avatar v-if="!miniVariant">
          <v-icon>
						mdi-magnify-plus
          </v-icon>
        </v-list-item-avatar>   
        <v-list-item-icon v-else>
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
          >
            <v-icon left>mdi-chevron-left</v-icon>
          </v-btn>
          </v-list-item-icon>

        <v-list-item-title>{{ $t('rightDrawer.header') }}</v-list-item-title>
        <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-list-item>
      <!-- Participant displayer selector, available options are: all and selected ones from node chart -->
      <v-list-item>
        <v-select
          v-model="rightDrawerOption"
          :items="drawerOptions"
          item-value="id"
          :item-text="setOptionText()"
          :label="$t('rightDrawer.participantsDisplay')"
          prepend-icon="mdi-format-list-bulleted"
          required
          :rules="selectRules"
          :disabled="!classroomChartOn"
        >
        </v-select>	
      </v-list-item>
      <!-- Participants list -->
      <v-list-group
        v-for="participant in drawerParticipants"
        :key="participant.index"
        no-action
				dark
      >
        <!-- Sets an icon and username for each node chart selected participant --> 
        <template v-slot:activator>
          <v-icon 
						:color="setColor(participant.results[principal]) + ' lighten-1'"
						left
					>
						mdi-checkbox-blank-circle
					</v-icon>
          <v-list-item-title v-text="participant.username"></v-list-item-title>
        </template>
        <!-- Sets card color to match participant node color from node chart --> 
        <v-card 
          shaped
          v-bind:class="setColor(participant.results[principal]) + 'ItemDisplay'"
          :color="setColor(participant.results[principal]) + ' lighten-3'"
        >
          <!-- For each participant, the first list item is a clickable item to find the associated node in the node chart -->
          <v-list-item
            link
            @click="findInChart(participant.username)"
          >
            <v-icon left>mdi-magnify</v-icon>
            <v-list-item-title class="metricDisplay">{{ $t('rightDrawer.findInChart') }}</v-list-item-title>            
          </v-list-item>
          <!-- Displays all selected participants, the session selected metrics and the result for each one, sets the metric item 
          clickable to set the line chart -->           
          <v-list-item
            v-for="(value, metric, index) in participant.results"
            :key="index"
            link
            @click="setLineChart(participant.username, metric)"
          >    
            <v-tooltip left v-if="!miniVariant">
              <template v-slot:activator="{ on }">        
                <v-list-item-content v-on="on">
                  <v-list-item-icon >
                    <v-icon left>mdi-chart-line</v-icon>
                    <v-list-item-title class="metricDisplay">{{ setAlias(metric) }}: {{ value }}</v-list-item-title>
                  </v-list-item-icon>
                </v-list-item-content>
              </template>
              {{ $t('rightDrawer.viewChart')}}               
            </v-tooltip> 
          </v-list-item>
        </v-card>  
        <v-divider dark/>
      </v-list-group>
    </v-list>
	</v-navigation-drawer>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import axios from 'axios';

export default {
	name: 'RightDrawer',

	data (){
    return{
      /*Component properties*/
      miniVariant: true,	
      principal: '',
      limit: '',
      option: '',
      /*Array*/      
      drawerOptions: [
        { id: 1, name: 'rightDrawer.drawerOptions.all' },				
        { id: 2, name: 'rightDrawer.drawerOptions.selected' }
      ],
      drawerParticipants: [],
      /*Rules*/
			selectRules: [
        v => v && v != null || this.$t('rules.requiredRule')
			],
    }
	},

	/*
	@fvillarrealcespedes:
	Invoked before the rendering. Gets the session settings from store and initializes the component properties. 
	*/
	created(){
		this.principal = this.settings.principal;
		this.limit = this.settings.limit;
    this.option = this.settings.option;
  },

  methods:{
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
    Sets and saves the rightDrawerParticipantUsername property to store.
		*/  
    findInChart(participantUsername){
      this.rightDrawerParticipantUsername = participantUsername;
    },

		/*
		@fvillarrealcespedes:
		Searches in metrics array the metric object where name property equals the given name param, then returns that object alias.
		*/
    setAlias(name){
      var metric = this.metrics.find(metric => metric.name === name);
      return metric.alias;
    },

		/*
		@fvillarrealcespedes:
    Sets the color for each card of the drawer depending on the principal metric value when the alert option is setted "1" or "2". 
    If the alert option is setted "", the color is always the same, blue. This color equals exactly the participant's node color 
    from the node chart. 
		*/    
		setColor(value){
			switch(this.option){
				/*The value must not be over the limit*/
				case "1":
					/*Red when the value is over the limit*/
					if(value > Number(this.limit)){
						return 'red';
          }
					/*Orange when the value equals the limit*/
					else if(value === Number(this.limit)){
						return 'orange';
          }
          /*Green when the value is under the limit*/
					else{
						return 'green';
					}	
          break;
        /*The value must not be under the limit*/							
				case "2":
          /*Red when the value is under the limit*/
					if(value < Number(this.limit)){
						return 'red';
          }
					/*Orange when the value equals the limit*/
					else if(value === Number(this.limit)){
						return 'orange';
          }
          /*Green when the value exceeds the limit*/
					else{
						return 'green';
					}					
        /*Blue if the alert option is disabled*/
        default:
					return 'blue';
			}
    }, 
    
		/*
		@fvillarrealcespedes:
    Sets lineChartUsername and lineChartSelectedMetric properties, then sets true the condition to show the line chart.
		*/      
    async setLineChart(username, selectedMetric){
      this.lineChartUsername = username;
      this.lineChartSelectedMetric = selectedMetric;
			await axios
			.get(`${process.env.VUE_APP_NEURONE_AM_COORDINATOR_API_URL}/initstage/${this.lineChartUsername}`)
			.then(response => {
        let sessionInitTime = response.data.inittime;
				if(sessionInitTime === 0){
					this.dispatchNotification('lineChart.alert', 'alert', 5000, 'yellow darken-3');
					return;
				}
        this.showLineChart = true;
			})
      .catch(error => {
        console.log(error);
      });
    },

		/*
		@fvillarrealcespedes:
		Sets for each drawerOptions array object the text to display in the selector component.
		*/
    setOptionText(){
     return item => this.$t(item.name);
    }
	},

	watch: {   
    /*
		@fvillarrealcespedes:
		Watches the rightDrawerOption property to select the participants to show in the drawer.
		*/		
    rightDrawerOption: function(){
      if(this.classroomChartOn){
        this.drawerParticipants = [];
        switch(this.rightDrawerOption){
          case 1:
            this.drawerParticipants = this.allParticipants;
            break;
          case 2:
            this.drawerParticipants = this.selectedParticipants;
            break;
        }
      }else{
        this.drawerParticipants = [];
      }
    },

    /*
		@fvillarrealcespedes:
		Watches the classroomChartOn property to select when the participants can be showed in the drawer.
		*/		
    classroomChartOn: function(){
      if(!this.classroomChartOn){
        this.drawerParticipants = [];
      }else{
        switch(this.rightDrawerOption){
          case 1:
            this.drawerParticipants = this.allParticipants;
            break;
          case 2:
            this.drawerParticipants = this.selectedParticipants;
            break;
        }        
      }
    },

		/*
		@fvillarrealcespedes:
		Watches the selectedParticipants array to show its content in the drawer.
    */		
    selectedParticipants: function(){
      if(this.rightDrawerOption === 2){
        this.drawerParticipants = this.selectedParticipants;
      }
    }
  },

	computed: {
    /*
		@fvillarrealcespedes:
		AllParticipants to display in the right drawer, get and set methods are imported from store.
		*/	    
    allParticipants: {
      get () {
        return this.$store.getters.getAllParticipants;
      },
      set (payload) {
        this.$store.commit('setAllParticipants', payload);
      }
    },

    /*
		@fvillarrealcespedes:
		Boolean property to alert if the node chart is being showed or not, get and set methods are imported from store.
		*/
		classroomChartOn: {
      get () {
        return this.$store.getters.getClassroomChartOn;
      },
      set (payload) {
        this.$store.commit('setClassroomChartOn', payload);
      }
		},    

		/*
		@fvillarrealcespedes:
		LineChartSelectedMetric for line chart, get and set methods are imported from store.
		*/	
    lineChartSelectedMetric: {
      get (){
        return this.$store.getters.getLineChartSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setLineChartSelectedMetric', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		LineChartUsername for line chart, get and set methods are imported from store.
		*/	
    lineChartUsername: {
      get (){
        return this.$store.getters.getLineChartUsername;
      },      
      set (payload){
        this.$store.commit('setLineChartUsername', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		Array that includes all available performance metrics in NEURONE-AM, get and set methods are imported from store.
		*/	
		metrics: {
			get () {
				return this.$store.getters.getMetrics;
			},
			set (payload) {
				this.$store.commit('setMetrics', payload);
			}
    },      

    /*
		@fvillarrealcespedes:
		Condition to show the right drawer, get and set methods are imported from store.
		*/    
		rightDrawer: {
			get () {
				return this.$store.getters.getRightDrawer;
			},
			set (payload) {
				this.$store.commit('setRightDrawer', payload);
			},
    },

		/*
		@fvillarrealcespedes:
    Option to select the right drawer visualization option, get and set methods are imported from store. 
    */  
		rightDrawerOption: {
			get () {
				return this.$store.getters.getRightDrawerOption;
			},
			set (payload) {
				this.$store.commit('setRightDrawerOption', payload);
			},
    },    

    /*
		@fvillarrealcespedes:
		RightDrawerParticipantUsername to find in node chart the selected participant from the left drawer, get and set methods are 
		imported from store.
		*/	    
    rightDrawerParticipantUsername: {
      get () {
        return this.$store.getters.getRightDrawerParticipantUsername;
      },
      set (payload) {
        this.$store.commit('setRightDrawerParticipantUsername', payload);
      }
    },

    /*
		@fvillarrealcespedes:
		SelectedParticipants to display in the right drawer, get and set methods are imported from store.
		*/	    
    selectedParticipants: {
      get () {
        return this.$store.getters.getSelectedParticipants;
      },
      set (payload) {
        this.$store.commit('setSelectedParticipants', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		Object that includes all session settings, get and set methods are imported from store.
		*/	
		settings: {
			get () {
				return this.$store.getters.getSettings;
			},
			set (payload) {
				this.$store.commit('setSettings', payload);
			}
    },

		/*
		@fvillarrealcespedes:
		Condition to show the line chart, get and set methods are imported from store.
		*/	
    showLineChart: {
      get () {
        return this.$store.getters.getShowLineChart;
      },    
      set (payload){
        this.$store.commit('setShowLineChart', payload);
      }
    }
  }  
}
</script>

<style scoped>
.v-list-item__title{
  color: #FFFFFF !important;
}
.v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon{
  color: #FFFFFF !important;
}
.v-list-item__icon .v-list-group__header__append-icon{
  color: #FFFFFF !important;
}
.v-list-item--active{
  color: #FFFFFF !important;
}
.v-application .primary--text{
  color: #FFFFFF !important;
}
.v-list-group__header .v-list-item .v-list-item--active .v-list-item--link{
  color: #FFFFFF !important;
}
.v-list-group .v-list-group--active .v-list-group--no-action .primary--text{
  color: #FFFFFF !important;
}
.v-application--is-ltr .v-list--dense.v-list--nav .v-list-group--no-action > .v-list-group__items > .v-list-item{
  padding-left: 20px;
}
.theme--dark.v-card{
  margin-top: 5px;
  margin-bottom: 5px;
}
.metricDisplay{
  color: #000000 !important;
}
.redItemDisplay{
  border: 3px solid #F44336;
}
.orangeItemDisplay{
  border: 3px solid #FF9800;
}
.greenItemDisplay{
  border: 3px solid #4CAF50;
}
.blueItemDisplay{
  border: 3px solid #2196F3;
}
.v-application .red.lighten-3{
  border-color: #F44336 !important;
}
.v-application .orange.lighten-3{
  border-color: #FF9800 !important;
}
.v-application .green.lighten-3{
  border-color: #4CAF50 !important;
}
.v-application .blue.lighten-3{
  border-color: #2196F3 !important;
}
</style>