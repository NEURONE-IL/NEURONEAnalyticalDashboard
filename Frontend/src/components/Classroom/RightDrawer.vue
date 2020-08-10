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
		:color="color"
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

        <v-list-item-title>Métricas completas</v-list-item-title>
        <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-list-item>
      <!-- List group, contains the nodes chart selected participants -->      
      <v-list-group
        v-for="participant in selectedParticipants"
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
          :color="setColor(participant.results[principal]) + ' lighten-3'"
        >
          <!-- Displays all selected participants, the session selected metrics and the result for each one, set the metric item 
          clickable to set the line chart --> 
          <v-list-item
            v-for="(value, metric, index) in participant.results"
            :key="index"
            v-bind:class="setColor(participant.results[principal]) + 'ItemDisplay'"
            link
            @click="setLineChart(participant.username, metric)"
          >
            <v-icon left>mdi-circle-medium</v-icon>
            <v-list-item-title class="metricDisplay">{{ metric }}: {{ value }}</v-list-item-title>          
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
      color: 'primary',
      miniVariant: true,	
      principal: '',
      limit: '',
      option: ''
    }
	},

	/*
	@fvillarrealcespedes:
	Invoked before the rendering. Gets the configuration from the store and initializes the component properties. 
	*/
	created(){
		let configuration = this.$store.getters.getConfiguration;
		this.principal = configuration.principal;
		this.limit = configuration.limit;
    this.option = configuration.option;
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
    Sets the username and selectedMetric properties, then sets true the condition to show the line chart.
		*/      
    setLineChart(username, selectedMetric){
      this.username = username;
      this.selectedMetric = selectedMetric;
      this.showLineChart = true;
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
		Username for the line chart, get and set methods are imported from the store.
		*/
    username: {
      get (){
        return this.$store.getters.getUsername;
      },      
      set (payload){
        this.$store.commit('setUsername', payload);
      }
    },

		/*
		@fvillarrealcespedes:
		SelectedMetric for the line chart, get and set methods are imported from the store.
		*/
    selectedMetric: {
      get (){
        return this.$store.getters.getSelectedMetric;
      },       
      set (payload){
        this.$store.commit('setSelectedMetric', payload);
      }
    }
	},
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
  border: 4px solid #F44336;
  margin-bottom: 2px;
}
.orangeItemDisplay{
  border: 4px solid #FF9800;
  margin-bottom: 2px;  
}
.greenItemDisplay{
  border: 4px solid #4CAF50;
  margin-bottom: 2px;  
}
.blueItemDisplay{
  border: 4px solid #2196F3;
  margin-bottom: 2px;  
}
</style>
