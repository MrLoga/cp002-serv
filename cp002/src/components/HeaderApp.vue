<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>
        CP002 Wallet β
      </q-toolbar-title>

      <q-btn dense size="lg" v-ripple flat round icon="menu" @click="toggleMenu" />
    </q-toolbar>

    <q-tabs class="headerMenu" dense align="left" v-model="tab">
      <q-route-tab to="/home" :label="$t('Home')" icon="home" />
      <q-route-tab to="/wallet" :label="$t('My Wallet')" icon="account_balance_wallet" />
      <q-route-tab to="/send" :label="$t('Send')" icon="send" />
      <q-route-tab to="/services" :label="$t('Services')" icon="star" />

      <!-- <q-route-tab to="/requests" :label="$t('Request')" icon="comment">
        <q-badge v-if="requestsCount" color="red" floating style="margin-right: 6px;" :label="requestsCount" />
      </q-route-tab> -->
      <!-- <q-route-tab to="/request" label="Request" icon="lock_open" /> -->
      <!-- <q-route-tab to="/qr-code" label="QR Code" icon="camera_alt" /> -->
    </q-tabs>
  </q-header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'header-app',
  data () {
    return {
      tab: 'main-tab'
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      requests: state => state.request.requests
    }),
    ...mapGetters([
      'requestsCount'
    ])
  },
  methods: {
    toggleMenu () {
      this.$store.commit('SET_MENU', true)
    },
    logout () {
      // setTimeout(() => {
      //   this.$store.commit('LOGOUT')
      //   this.$router.push({ path: '/start' })
      // }, 200)
    }
  }
}
</script>
<style>
  @media screen and (max-width: 410px) {
    .headerMenu .q-tab__label {
      font-size: 0;
      transition: font-size 0.3s;
    }
    .headerMenu .q-tab--active .q-tab__label {
      transition: font-size 0.3s;
      font-size: 14px;
    }
  }
</style>
