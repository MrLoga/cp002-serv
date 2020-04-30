<template>
  <div>
    <q-header bordered flat elevated class="bg-light-blue-9 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Reef Wallet β
        </q-toolbar-title>

        <q-btn dense size="lg" v-ripple flat round icon="menu" @click="toggleMenu" />
      </q-toolbar>
      <q-tabs v-if="menu === 'header'" class="headerMenu" dense align="justify" v-model="tab">
        <q-route-tab to="/home" :label="$t('Home')" icon="home" />
        <q-route-tab to="/wallet" :label="$t('My Wallet')" icon="account_balance_wallet" />
        <q-route-tab to="/send" :label="$t('Send')" icon="send" />
        <q-route-tab to="/qr-code" icon="camera_alt" label="QR" />
        <!-- <q-route-tab to="/services" :label="$t('Services')" icon="star" /> -->
      </q-tabs>
    </q-header>
    <q-footer v-if="menu === 'footer'" bordered flat elevated class="bg-light-blue-9 text-white" height-hint="98">
      <q-tabs class="headerMenu" dense align="justify" v-model="tab">
        <q-route-tab to="/home" :label="$t('Home')" icon="home" />
        <q-route-tab to="/wallet" :label="$t('My Wallet')" icon="account_balance_wallet" />
        <q-route-tab to="/send" :label="$t('Send')" icon="send" />
        <q-route-tab to="/qr-code" icon="camera_alt" label="QR" />
        <!-- <q-route-tab to="/services" :label="$t('Services')" icon="star" /> -->
      </q-tabs>
    </q-footer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'HeaderApp',
  data () {
    return {
      tab: 'main-tab'
    }
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
  },
  computed: {
    ...mapState({
      menu: state => state.app.menu
    }),
    ...mapGetters([
      // 'requestsCount'
    ])
  }
}
</script>
<style>
  @media screen and (max-width: 410px) {
    .headerMenu .q-tab__icon {
      transition: transform 0.3s;
    }
    .headerMenu .q-tab--active .q-tab__icon {
      transform: translate3d(0, -10px, 0);
    }
    .headerMenu .q-tab__label {
      font-size: 0.7rem;
      opacity: 0;
      margin-bottom: -1.2rem;
      transform: translate3d(0, 0, 0) scale3d(0.5, 0.5, 0.5);
      transition: transform 0.3s, opacity 0.2s;
    }
    .headerMenu .q-tab--active .q-tab__label {
      transform: translate3d(0, -10px, 0) scale3d(1, 1, 1);
      opacity: 1;
    }
  }
</style>
