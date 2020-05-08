<template>
  <div>
    <q-header bordered flat elevated class="header text-white" height-hint="98"><!-- bg-light-blue-9 -->
      <q-toolbar>
        <WalletSelect class="col-md-4 col-sm-6 col" />
        <q-space />
        <!-- <q-toolbar-title>
          Reef Wallet β
        </q-toolbar-title> -->

        <q-btn dense size="lg" v-ripple flat round icon="menu" @click="toggleMenu" />
      </q-toolbar>
      <q-tabs active-bg-color="light-blue-10" v-if="menu === 'header'" class="headerMenu" dense align="justify" v-model="tab">
        <q-route-tab to="/home" :label="$t('Home')" icon="home" />
        <q-route-tab to="/wallet" :label="$t('My Wallet')" icon="account_balance_wallet" />
        <q-route-tab to="/send" :label="$t('Send')" icon="send" />
        <q-route-tab to="/qr-code" icon="camera_alt" label="QR" />
        <!-- <q-route-tab to="/services" :label="$t('Services')" icon="star" /> -->
      </q-tabs>
    </q-header>
    <q-footer v-if="menu === 'footer'" bordered flat elevated class="bg-light-blue-10 text-white" height-hint="98">
      <q-tabs active-bg-color="light-blue-9" class="headerMenu" dense align="justify" v-model="tab">
        <q-route-tab no-caps to="/home" :label="$t('Home')" icon="home" />
        <q-route-tab no-caps to="/wallet" :label="$t('My Wallet')" icon="account_balance_wallet" />
        <q-route-tab no-caps to="/send" :label="$t('Send')" icon="send" />
        <q-route-tab no-caps to="/qr-code" icon="camera_alt" label="QR" />
        <!-- <q-route-tab to="/services" :label="$t('Services')" icon="star" /> -->
      </q-tabs>
    </q-footer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WalletSelect from './WalletSelect.vue'

export default {
  name: 'HeaderApp',
  components: {
    WalletSelect
  },
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
