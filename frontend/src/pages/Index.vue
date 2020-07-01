<template>
  <q-page padding>
    <div v-if="wallets">
      <div class="row justify-between">
        <q-item-label class="col" header>{{ $t('Wallets') }}</q-item-label>
        <div class="col q-pa-md text-right text-caption">{{ prettyNumber(totalWalletsBip, 2) }} BIP</div>
      </div>
      <q-card>
        <!-- <q-item-label header>{{ $t('Observer') }}</q-item-label> -->
        <q-list separator class="q-mb-md">
          <WalletItem v-for="(item, index) in walletsSelect" :key="index" :wallet="item" />
        </q-list>
      </q-card>
    </div>
    <div v-if="observer && observer.length">
      <div class="row justify-between">
        <q-item-label class="col" header>{{ $t('Observers') }}</q-item-label>
        <div class="col q-pa-md text-right text-caption">{{ prettyNumber(totalObserversBip, 2) }} BIP</div>
      </div>
      <q-card>
        <!-- <q-item-label header>{{ $t('Observer') }}</q-item-label> -->
        <q-list separator class="q-mb-md">
          <WalletItem v-for="(item, index) in observerSelect" :key="index" :wallet="item" type="observer" />
        </q-list>
      </q-card>
    </div>

    <q-item-label header>{{ $t('Services') }}</q-item-label>
    <div class="row q-mb-lg">
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <AddWallet />
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <AddObserver />
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-xs" to="/contacts">
          <q-icon name="supervisor_account" size="1.4rem" class="text-white" />
          <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Contacts') }}</div>
        </q-btn>
      </div>
      <!-- <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-xs" to="/profile">
          <q-icon name="account_circle" size="1.4rem" class="text-white" />
          <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Profile') }}</div>
        </q-btn>
      </div> -->
    </div>

  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
// import nacl from 'tweetnacl'
import { prettyNumber } from '../utils'
import AddWallet from '../components/AddWallet.vue'
import AddObserver from '../components/AddObserver.vue'
// import BalanceValue from '../components/BalanceValue.vue'
import WalletItem from '../components/WalletItem.vue'
// import ObserverItem from '../components/ObserverItem.vue'
// nacl.util = require('tweetnacl-util')

export default {
  name: 'Index',
  components: {
    AddWallet,
    AddObserver,
    WalletItem
    // ObserverItem
    // BalanceValue
  },
  data () {
    return {
      language: this.$i18n.locale,
      qrAddress: false,
      currentWallet: null,
      newObserverDialog: false,
      newObserverAddress: null
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
    saveNewObserver () {

    },
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
      observer: state => state.wallet.observer,
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
      'totalWalletsBip',
      'totalObserversBip',
      'observerSelect',
      'findWallet'
      // 'balanceObj',
      // 'coinsInfo'
    ])
  }
}
</script>
