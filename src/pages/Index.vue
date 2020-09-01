<template>
  <q-page padding>
    <div v-if="wallets">
      <div class="row justify-between">
        <q-item-label class="col" header>{{ $t('Wallets') }}</q-item-label>
        <div class="col q-pa-md text-right text-caption">{{ prettyNumber(totalWalletsBip, 2) }} BIP</div>
      </div>
      <q-card>
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
        <q-list separator class="q-mb-md">
          <WalletItem v-for="(item, index) in observerSelect" :key="index" :wallet="item" type="observer" />
        </q-list>
      </q-card>
    </div>

    <q-item-label header>{{ $t('Services') }}</q-item-label>
    <div class="row q-mb-lg">
      <div v-if="!isAuth" class="col-md-12 col-xs-12 q-pa-xs">
        <q-btn push stack class="bg-positive text-white full-width q-pa-xs" to="/profile/reg">
          <q-icon name="account_circle" size="1.4rem" class="text-white" />
          <div style="font-size: 0.8rem" class="text-width-medium">{{ $t('Create account') }}</div>
        </q-btn>
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <AddWallet />
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <AddObserver />
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pa-xs" to="/contacts">
          <q-icon name="supervisor_account" size="1.4rem" class="text-white" />
          <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Contacts') }}</div>
        </q-btn>
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn v-if="isAuth" push stack class="bg-light-blue-14 text-white full-width q-pa-xs" to="/profile">
          <q-icon name="account_circle" size="1.4rem" class="text-white" />
          <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Profile') }}</div>
        </q-btn>
        <q-btn v-else push stack class="bg-light-blue-14 text-white full-width q-pa-xs" to="/profile/login">
          <q-icon name="account_circle" size="1.4rem" class="text-white" />
          <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Sign In') }}</div>
        </q-btn>
      </div>
    </div>

  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import { prettyNumber } from '../utils'
import AddWallet from '../components/AddWallet.vue'
import AddObserver from '../components/AddObserver.vue'
import WalletItem from '../components/WalletItem.vue'

export default {
  name: 'Index',
  components: {
    AddWallet,
    AddObserver,
    WalletItem
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
    prettyNumber (val, l) { return prettyNumber(val, l) }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      observer: state => state.wallet.observer,
      balance: state => state.api.balance
    }),
    ...mapGetters([
      'balanceSum',
      'balanceCustom',
      'walletsSelect',
      'totalWalletsBip',
      'totalObserversBip',
      'observerSelect',
      'findWallet',
      'isAuth'
    ])
  }
}
</script>
