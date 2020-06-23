<template>
	<v-navigation-drawer
		v-model="leftDrawer"
		:mini-variant.sync="miniVariant"
    disable-route-watcher
    mobile-break-point="960"
		app
		dark	
		:color="color"
	>
		<v-list
			dense
			expand
			nav
			class="py-0"
		>
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
				v-for="item in items"
				:key="item.title"
				:to="item.route"
				link
				dark
			>
				<v-list-item-icon>
					<v-icon>{{ item.icon }}</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	name: 'LeftDrawer',

	data () {
		return {
			color: 'primary',
			items: [
				{ title: 'Sesión', icon: 'mdi-cogs', route: '/' },				
				{ title: 'Aula', icon: 'mdi-google-classroom', route: '/classroom' },
				{ title: 'Nueva configuración de aula', icon: 'mdi-file-plus', route: '/add'}
			],
			miniVariant: true
		}
	},

  computed: {
    leftDrawer: {
      get () {
        return this.$store.getters.getLeftDrawer;
      },
      set (payload) {
        this.$store.commit('setLeftDrawer', payload);
      },
    },
  }  
}	
</script>