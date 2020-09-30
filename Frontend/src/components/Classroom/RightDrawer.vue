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
    <!-- List to display the selected participants of the nodes chart and all their metrics search results -->
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

      <v-list-item>
        <v-select
          v-model="drawerVisualization"
          :items="drawerOptions"
          item-value="id"
          :item-text="setOptionText()"
          :label="$t('rightDrawer.participantsDisplay')"
          prepend-icon="mdi-format-list-bulleted"
          required
          :rules="selectRules"
        >
        </v-select>	
      </v-list-item>
      <v-list-group
        v-for="participant in drawerParticipants"
        :key="participant.index"
        no-action
				dark
      >
        <!-- Sets an icon and the username for each nodes chart selected participant --> 
        <template v-slot:activator>
          <v-icon left>mdi-account-circle</v-icon>
          <v-list-item-title v-text="participant.username"></v-list-item-title>
        </template>
        <!-- Sets the card color to match the participant's node color from the nodes chart --> 
        <v-card 
          shaped
          v-bind:class="setColor(participant.results[principal]) + 'ItemDisplay'"
          :color="setColor(participant.results[principal]) + ' lighten-3'"
        >
          <!-- Tthe second list item is a clickable item to view the participant associated node tooltip in the nodes chart -->
          <v-list-item
            link
            @click="findInChart(participant.username)"
          >
            <!--v-if="drawerVisualization === 1"-->
            <v-icon left>mdi-magnify</v-icon>
            <v-list-item-title class="metricDisplay">{{ $t('rightDrawer.findInChart') }}</v-list-item-title>            
          </v-list-item>
          <!-- Displays all selected participants, the session selected metrics and the result for each one, set the metric item 
          clickable to set the line chart -->           
          <v-list-item
            v-for="(value, metric, index) in participant.results"
            :key="index"
            link
            @click="setLineChart(participant.username, metric)"
          >
            <v-icon left>mdi-circle-medium</v-icon>
            <v-list-item-title class="metricDisplay">{{ setAlias(metric) }}: {{ value }}</v-list-item-title>          
          </v-list-item>
        </v-card>  
        <v-divider dark/>
      </v-list-group>
    </v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	name: 'RightDrawer',

	data (){
    return{
      /*Component properties*/
      miniVariant: true,	
      principal: '',
      limit: '',
      option: '',
      drawerVisualization: null,
      /*Array & rules*/      
      drawerOptions: [
        { id: 1, name: 'rightDrawer.drawerOptions.all' },				
        { id: 2, name: 'rightDrawer.drawerOptions.selected' }
      ],
      drawerParticipants: [],
			selectRules: [
        v => v && v != null || this.$t('rules.requiredRule')
			],
    }
	},

	/*
	@fvillarrealcespedes:
	Invoked before the rendering. Gets the session settings from the store and initializes the component properties. 
	*/
	created(){
		this.principal = this.settings.principal;
		this.limit = this.settings.limit;
    this.option = this.settings.option;
  },

	/*
	@fvillarrealcespedes:
	Invoked when the DOM is mounted and allows to access the reactive component. Sets the drawerVisualization property as 1. 
	*/
  mounted(){
    this.drawerVisualization = 1;
  },

  methods:{
		/*
		@fvillarrealcespedes:
    Sets the color for each card of the drawer depending on the principal metric value when the alert option is setted "1" or "2". 
    If the alert option is setted "", the color is always the same, blue. This color matches exactly the participant's node color 
    from the nodes chart. 
		*/    
		setColor(value){
			switch(this.option){
        /*The value must not exceed the limit*/
				case "1":
          /*Red when the value exceeds the limit*/
					if(value > Number(this.limit)){
						return 'red';
          }
          /*Orange when the value is the same that the limit*/
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
          /*Orange when the value is the same that the limit*/
					else if(value === Number(this.limit)){
						return 'orange';
          }
          /*Green when the value exceeds the limit*/
					else{
						return 'green';
					}	
					break;				
        /*Blue if the alert option is disabled*/
        default:
					return 'blue';
					break;
			}
    }, 
    
		/*
		@fvillarrealcespedes:
    Sets the lineChartUsername and lineChartSelectedMetric properties, then sets true the condition to show the line chart.
		*/      
    setLineChart(username, selectedMetric){
      this.lineChartUsername = username;
      this.lineChartSelectedMetric = selectedMetric;
      this.showLineChart = true;
    },

		/*
		@fvillarrealcespedes:
    Sets and saves the rightDrawerParticipantUsername property to store.
		*/  
    findInChart(participantUsername){
      this.rightDrawerParticipantUsername = participantUsername;
    },

    setOptionText(){
     return item => this.$t(item.name);
    },

    setAlias(name){
      var metric = this.metrics.find(metric => metric.name === name);
      return metric.alias;
    }
	},

	watch: {
		/*
		@fvillarrealcespedes:
		Watches the drawer visualization property to select the participants to show in the drawer.
		*/		
		drawerVisualization: function(){
      this.drawerParticipants = [];
      switch(this.drawerVisualization){
        case 1:
          this.drawerParticipants = this.allParticipants;
          break;
        case 2:
          this.drawerParticipants = this.selectedParticipants;
          break;
      }
      console.log(this.drawerParticipants)
    },

		/*
		@fvillarrealcespedes:
		Watches the drawer visualization property to select the participants to show in the drawer.
    */		
    allParticipants: function(){
      if(this.drawerVisualization === 1){
        this.drawerParticipants = this.allParticipants;
      }
    },

		/*
		@fvillarrealcespedes:
		Watches the drawer visualization property to select the participants to show in the drawer.
    */		
    selectedParticipants: function(){
      if(this.drawerVisualization === 2){
        this.drawerParticipants = this.selectedParticipants;
      }
    }
  },

	computed: {
		/*
		@fvillarrealcespedes:
		Condition to show the right drawer, get and set methods are imported from the store.
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
    Option to select the right drawer visualization option, get and set methods are imported from the store. 
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
		AllParticipants to display in the right drawer, get and set methods are imported from the store.
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
		SelectedParticipants to display in the right drawer, get and set methods are imported from the store.
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
		RightDrawerParticipantUsername to find in the nodes chart the selected participant from the left drawer, get and set methods are 
		imported from the store.
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
		Condition to show the line chart, get and set methods are imported from the store.
		*/	
    showLineChart: {
      get () {
        return this.$store.getters.getShowLineChart;
      },    
      set (payload){
        this.$store.commit('setShowLineChart', payload);
      }
    },    

		/*
		@fvillarrealcespedes:
		LineChartUsername for the line chart, get and set methods are imported from the store.
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
		LineChartSelectedMetric for the line chart, get and set methods are imported from the store.
		*/	
    lineChartSelectedMetric: {
      get (){
        return this.$store.getters.getLineChartSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setLineChartSelectedMetric', payload);
      }
    },

		metrics: {
			get () {
				return this.$store.getters.getMetrics;
			},
			set (payload) {
				this.$store.commit('setMetrics', payload);
			}
		},    
  
		settings: {
			get () {
				return this.$store.getters.getSettings;
			},
			set (payload) {
				this.$store.commit('setSettings', payload);
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