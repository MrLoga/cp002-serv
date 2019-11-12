<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'App',
  data () {
    return {}
  },
  method: {},
  computed: {
    ...mapState({
      coinsJSON: state => state.api.coinsJSON,
      validators: state => state.api.validators
    }),
    ...mapGetters([
      'isLogin',
      'isRegistered'
    ])
  },
  created () {
    if (process.env.DEV) {
      this.$store.commit('SET_DEV')
    }
  },
  mounted () {
    this.$store.commit('SAVE_GATE')
    if (this.isLogin) {
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')

      if (this.coinsJSON['BIP'] && this.coinsJSON['BIP'].crr === 0) {
        // console.log('Coins was uploaded')
      } else {
        this.$store.dispatch('FETCH_COINS')
      }
      if (this.validators && this.validators.length) {
        // console.log('Validators was uploaded')
      } else {
        this.$store.dispatch('FETCH_VALIDATORS')
      }

      if (this.isRegistered) {
        this.$store.dispatch('NEW_WS')
      }
    } else {
      this.$router.push({ path: '/start' })
    }
  }
}
</script>
