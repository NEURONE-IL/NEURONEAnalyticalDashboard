<template>
	<v-navigation-drawer
		v-model="rightDrawer"
		:mini-variant.sync="miniVariant"
    disable-route-watcher
    mobile-break-point="960"
		app
		dark	
		right
		:color="color"
	>
		<v-list
			dense
			expand
      dark
			class="py-0"
		>
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
      <v-list-group
        v-for="participant in participants"
        :key="participant.index"
        no-action
				dark
      >
        <template v-slot:activator>
          <v-icon left>mdi-account-circle</v-icon>
          <v-list-item-title v-text="participant.username"></v-list-item-title>
        </template>
        <v-card 
          shaped
          class="mb-2"
          :color="setColor(participant.results[principal])"
        >
          <v-list-item
            v-for="(value, metric, index) in participant.results"
            :key="index"
          >
            <v-icon left>mdi-circle-medium</v-icon>
            <v-list-item-title>{{ metric }}: {{ value }}</v-list-item-title>          
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

	data: () => ({
		color: 'primary',
    miniVariant: true,	
    principal: '',
    limit: '',
    option: ''
	}),

	created(){
		let configuration = this.$store.getters.getConfiguration;
		this.principal = configuration.principal;
		this.limit = configuration.limit;
    this.option = configuration.option;
  },

  methods:{
		setColor(value){
      console.log(this.participants[0].results[this.principal]);
			switch(this.option){
				case "1":
					if(value > Number(this.limit)){
						return '#F44336';
					}
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					else{
						return '#4CAF50';
					}	
					break;				
				case "2":
					if(value < Number(this.limit)){
						return '#F44336';
					}
					else if(value === Number(this.limit)){
						return '#FF9800';
					}
					else{
						return '#4CAF50';
					}	
					break;				
				default:
					return '#2196F3';
					break;
			}
		}
	},

	computed: {
		rightDrawer: {
			get () {
				return this.$store.getters.getRightDrawer;
			},
			set (payload) {
				this.$store.commit('setRightDrawer', payload);
			},
    },

    participants: {
      get () {
        return this.$store.getters.getParticipants;
      },
      set (payload) {
        this.$store.commit('setParticipants', payload);
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
</style>
