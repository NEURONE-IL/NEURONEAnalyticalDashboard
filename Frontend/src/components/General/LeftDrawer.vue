<template>
	<!-- Navigation Drawer -->
	<v-navigation-drawer
		v-model="leftDrawer"
		:mini-variant.sync="miniVariant"
    disable-route-watcher
    mobile-breakpoint="960"
		app
		dark	
		:color="color"
	>
		<!-- List to display the view tabs -->
		<v-list
			dense
			expand
			nav
			class="py-0"
		>
			<!-- First list item, just header with the username -->
			<v-list-item>
        <v-list-item-avatar v-if="!miniVariant">
          <v-icon>
						mdi-account
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-icon v-else>
          <v-btn
            icon
            @click.stop="miniVariant = !miniVariant"
          >
            <v-icon left>mdi-chevron-right</v-icon>
          </v-btn>
        </v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title class="username">
						{{ user.username }}
					</v-list-item-title>
					<v-list-item-subtitle>
						{{ user.email }}
					</v-list-item-subtitle>				
				</v-list-item-content>
        <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
			<!-- List items, with a v-for loop display all available tabs, for each one requires the title, the route when clicked and a boolean 
			property in case it needs to be disabled -->      
			<v-list-item
				v-for="tab in tabs"
				:key="tab.title"
				:to="tab.route"
				:disabled="tab.disabled"
				link
				dark
			>
				<!-- Shows a representative icon for each tab and the the title -->
				<v-list-item-icon>
					<v-icon>{{ tab.icon }}</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ $t(tab.title) }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>    
		<template v-slot:append>
			<v-list-item
				dark
				v-if="!miniVariant"
			>
					<svg height="34" width="34">
						<g>
						<circle cx="16" cy="16" r="15" stroke="white" stroke-width="2px" fill="transparent"/>
						<text x="16" y="16" text-anchor="middle" stroke="#0000" stroke-width="2px" dy=".3em"> {{ getLocale($i18n.locale) }} </text>
						</g>
					</svg>
				<span class="mb-1 pa-2"> {{ $t('locale.language') }} </span>
			</v-list-item>			
		</template>
	</v-navigation-drawer>
</template>

<script>
export default {
	name: 'LeftDrawer',

	data () {
		return {
			/*Component properties*/
			color: 'primary',
			miniVariant: true
		}
	},

	methods: {
		getLocale(locale){
			var splitted = locale.split('-');
			if(splitted[0]){
				return splitted[0].toUpperCase();
			}else{
				return locale.toUpperCase();
			}
		}
	},

  computed: {
		/*
		@fvillarrealcespedes:
		Condition to show the left drawer, get and set methods are imported from the store.
		*/ 		
    leftDrawer: {
      get () {
        return this.$store.getters.getLeftDrawer;
      },
      set (payload) {
        this.$store.commit('setLeftDrawer', payload);
      },
		},

		/*
		@fvillarrealcespedes:
		Tabs to to display in the right drawer, get and set methods are imported from the store.
		*/ 
		tabs: {
      get () {
        return this.$store.getters.getTabs;
      },
      set (payload) {
        this.$store.commit('setTabs', payload);
      },
		},

		user: {
      get () {
        return this.$store.getters.getUser;
      },
      set (payload) {
        this.$store.commit('setUser', payload);
      }
		}
	}
}	
</script>

<style scoped>
.username{
	font-size: 16px !important;
	font-weight: bold;
}
</style>