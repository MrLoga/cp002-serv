<template>
  <div id="q-app">
    <router-view class="bg-grey-1" />
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
    this.$store.commit('SET_API')

    const nowDate = new Date()
    const lastDate = new Date()
    lastDate.setDate(lastDate.getDate() - 1)
    this.$store.dispatch('GET_CURRENCY')
    this.$store.dispatch('GET_STATUS')
    // this.$store.dispatch('FETCH_COINS')
    if (!this.dataUpdateDate || (this.dataUpdateDate && this.dataUpdateDate < lastDate.getTime())) {
      this.$store.dispatch('FETCH_ALL_PROFILES')
      this.$store.dispatch('FETCH_COINS')
      this.$store.dispatch('FETCH_VALIDATORS')
      // this.$store.dispatch('FETCH_VALIDATORS_COMMISSIONS')
      this.$store.commit('SET_UPDATE_DATE', nowDate.getTime())
    } else {
      if (!this.coins) this.$store.dispatch('FETCH_COINS')
      if (!this.validators) this.$store.dispatch('FETCH_VALIDATORS')
      if (!this.profiles) this.$store.dispatch('FETCH_ALL_PROFILES')
    }
    if (!this.validatorsCommissions) this.$store.dispatch('FETCH_VALIDATORS_COMMISSIONS')
  },
  mounted () {
    // this.$store.dispatch('FETCH_CURRENCY')
    if (this.isAuth) {
      this.$store.dispatch('GET_USER_PROFILE')
      this.$store.dispatch('SYNC_USER_CONTACTS')
    }
    if (this.isLogin) {
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')
    }
  },
  computed: {
    ...mapState({
      language: state => state.app.language,
      coins: state => state.api.coins,
      profiles: state => state.contacts.profiles,
      dataUpdateDate: state => state.app.dataUpdateDate,
      validators: state => state.api.validators,
      validatorsCommissions: state => state.api.validatorsCommissions
    }),
    ...mapGetters([
      'isLogin',
      'isAuth'
    ])
  }
}
</script>
