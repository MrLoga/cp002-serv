<template>
  <q-page padding>
    <div v-if="wallets">
      <q-item-label header>{{ $t('Wallets') }}</q-item-label>
      <q-card>
        <q-list separator class="q-mb-md">
          <WalletItem v-for="(item, index) in walletsSelect" :key="index" :wallet="item" />
        </q-list>
      </q-card>
    </div>

    <q-item-label header>{{ $t('Services') }}</q-item-label>
    <div class="row q-mb-lg">
      <!-- <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/convert">
          <div><q-icon name="compare_arrows" size="2rem" class="text-white" /></div>
          {{ $t('Convert coins') }}
        </q-btn>
      </div> -->
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/contacts">
          <q-icon name="supervisor_account" size="2rem" class="text-white" />
          <div style="font-size: 0.8rem">{{ $t('Contacts') }}</div>
        </q-btn>
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <AddWallet />
      </div>
    </div>

  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
// import nacl from 'tweetnacl'
import { prettyNumber } from '../utils'
import AddWallet from '../components/AddWallet.vue'
// import BalanceValue from '../components/BalanceValue.vue'
import WalletItem from '../components/WalletItem.vue'
// nacl.util = require('tweetnacl-util')

export default {
  name: 'Index',
  components: {
    AddWallet,
    WalletItem
    // BalanceValue
  },
  data () {
    return {
      language: this.$i18n.locale,
      qrAddress: false,
      currentWallet: null
    }
  },
  created () {
    this.currentWallet = this.findWallet(this.address)
  },
  methods: {
    // registerAddress () {
    //   this.$store.dispatch('REGISTER_ADDRESS')
    // },
    // getAddress () {
    //   this.$store.dispatch('GET_ADDRESS')
    // },
    prettyNumber (val, l) { return prettyNumber(val, l) },
    // selectWallet (address) {
    //   this.$store.commit('SET_WALLET', address)
    //   this.$store.dispatch('FETCH_BALANCE')
    //   this.$store.dispatch('FETCH_DELEGATION')
    // },
    copyAddress () {
      navigator.clipboard.writeText(this.address).then(() => {
        this.$q.notify({
          message: this.$t('Address copied'),
          color: 'purple',
          position: 'bottom',
          timeout: 300
        })
      }).catch(() => {})
    }
    // signFee () {
    //   return getFeeValue(TX_TYPE_SEND, { payload: 'MX4qptIH0mXijR8XlroE56txuOeyig==' })
    // }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      // key: state => state.wallet.key,
      // nonce: state => state.wallet.nonce,
      // currency: state => state.request.currency,
      balance: state => state.api.balance
      // balancesJSON: state => state.api.balancesJSON,
      // delegations: state => state.api.delegations
    }),
    ...mapGetters([
      // 'isRegistered',
      'balanceSum',
      'balanceCustom',
      'walletsSelect',
      'findWallet'
      // 'balanceObj',
      // 'coinsInfo'
    ])
  }
}
</script>
