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
        <v-list-item-title>Usuario</v-list-item-title>
        <v-btn
          icon
          @click.stop="miniVariant = !miniVariant"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

			<v-list-item
				link
				dark
			>
        <v-list-item-icon v-if="miniVariant">
            <v-icon left>mdi-translate</v-icon>
        </v-list-item-icon>
				<LanguageSwitcher/>
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
	</v-navigation-drawer>
</template>

<script>
/*
@fvillarrealcespedes:
Component imports.
*/
import LanguageSwitcher from '../General/LanguageSwitcher';

export default {
	name: 'LeftDrawer',

	components: {
		LanguageSwitcher
	},

	data () {
		return {
			/*Component properties*/
			color: 'primary',
			miniVariant: true
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
		}
	}
}	
</script>