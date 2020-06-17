<template>
	<v-navigation-drawer
		v-model="drawer"
		:mini-variant.sync="mini"
		permanent
		app
		absolute
		dark		
		:color="color"
	>
    <v-list
      nav
    >
      <v-list-item>
        <v-list-item-avatar v-if="!mini">
					<!--Pic-->
        </v-list-item-avatar>
        
        <v-list-item-icon v-else>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon left>mdi-chevron-right</v-icon>
          </v-btn>
          </v-list-item-icon>

        <v-list-item-title>Profesor</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>

    <v-divider/>

		<v-list dense>
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
	name: 'Layout',

	data () {
		return {
			color: 'primary',
			drawer: null,
			items: [
				{ title: 'Sesión', icon: 'mdi-account-plus', route:'/' },				
				{ title: 'Aula', icon: 'mdi-home', route:'/classroom' },
			],
			mini: true,
		}
	},
}	
</script>