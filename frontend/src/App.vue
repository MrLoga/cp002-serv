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
  created () {
    this.$i18n.locale = this.language
    this.$store.commit('SAVE_GATE')
    // if (process.env.DEV || location.hostname === 'localhost') {
    //   this.$store.commit('SET_DEV')
    // }
    const nowDate = new Date()
    const lastDate = new Date()
    lastDate.setDate(lastDate.getDate() - 3)
    console.log(lastDate.getTime())
    console.log(this.dataUpdateDate)
    console.log(this.dataUpdateDate < lastDate.getTime())
    this.$store.dispatch('GET_CURRENCY')
    if (!this.dataUpdateDate || (this.dataUpdateDate && this.dataUpdateDate < lastDate.getTime())) {
      this.$store.dispatch('FETCH_ALL_PROFILES')
      this.$store.dispatch('FETCH_COINS')
      this.$store.dispatch('FETCH_VALIDATORS')
      this.$store.commit('SET_UPDATE_DATE', nowDate.getTime())
    } else {
      if (!this.coins) this.$store.dispatch('FETCH_COINS')
      if (!this.validators) this.$store.dispatch('FETCH_VALIDATORS')
      if (!this.profiles) this.$store.dispatch('FETCH_ALL_PROFILES')
    }
  },
  mounted () {
    // this.$store.dispatch('FETCH_CURRENCY')
    if (this.isLogin) {
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')
      // if (this.isRegistered) {
      //   this.$store.dispatch('NEW_WS')
      // }
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      coins: state => state.api.coins,
      profiles: state => state.contacts.profiles,
      dataUpdateDate: state => state.app.dataUpdateDate,
      validators: state => state.api.validators
    }),
    ...mapGetters([
      'isLogin'
    ])
  }
}
</script>
