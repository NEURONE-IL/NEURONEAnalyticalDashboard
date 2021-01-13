<template>
  <div class="text-center">
    <!-- Snackbar component -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      top
    >
      <div
        class="font-weight-medium text-center"
      >
        <v-icon left>
          {{ snackbar.icon }}
        </v-icon> 
        {{ $t(snackbar.text) }}
      </div>
      <!-- Hide Snackbar button -->
      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          icon
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
	name: 'Notification',

  data (){
    return{
      //
    }
  },

  computed: {
		/*
		@fvillarrealcespedes:
		Snackbar data object, get and set methods are imported from store.
		*/ 
		snackbar: {
			get () {
				return this.$store.getters.getSnackbar;
			},
			set (payload) {
				this.$store.commit('setSnackbar', payload);
			}
    }
  }
}
</script>

<style scoped>
.v-snack__content{
  font-weight: 500 !important;
}
.v-application .font-weight-medium{
  font-size: 16px !important;
}
</style>