<template>
  <div id="q-app">
    <router-view class="bg-grey-2" />
    <!-- <div v-if="false">
      <q-dialog v-model="hasRequest" size="md" position="bottom">
        <q-card class="dialog-min300">
          <q-card-section class="row items-center">
            <q-spinner-facebook />
            <div class="text-h6 text-center q-pl-md">{{ $t('Sending') }}</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div> -->
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
      language: state => state.app.language,
      coins: state => state.api.coins,
      profiles: state => state.contacts.profiles,
      validators: state => state.api.validators
    }),
    ...mapGetters([
      'isLogin'
    ])
  },
  created () {
    this.$i18n.locale = this.language
    if (process.env.DEV || location.hostname === 'localhost') {
      this.$store.commit('SET_DEV')
    }
  },
  mounted () {
    this.$store.commit('SAVE_GATE')

    if (this.coins && this.coins.length) {
      // console.log('Coins was uploaded')
    } else {
      this.$store.dispatch('FETCH_COINS')
    }
    if (this.validators && this.validators.length) {
      // console.log('Validators was uploaded')
    } else {
      this.$store.dispatch('FETCH_VALIDATORS')
    }
    if (this.profiles && this.profiles.length) {
      // console.log('Profiles was uploaded')
    } else {
      this.$store.dispatch('FETCH_ALL_PROFILES')
    }
    // this.$store.dispatch('FETCH_CURRENCY')
    if (this.isLogin) {
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')

      // if (this.isRegistered) {
      //   this.$store.dispatch('NEW_WS')
      // }
    } else {
      // this.$router.push({ path: '/start' })
    }
  }
}
</script>
