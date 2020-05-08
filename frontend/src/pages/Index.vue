<template>
  <q-page padding>
    <div v-if="wallets">
      <!-- <q-card v-if="wallets.length === 1" flat bordered class="q-mb-lg q-mt-sm">
        <q-card-section>
          <div class="text-h6">
            {{ currentWallet.title }}
            <span class="text-grey-7 text-subtitle1">({{ address.substr(0, 4) + "..." + address.substr(-4) }})</span>
          </div>
          <div v-if="balance && balance.available_balance_sum" class="q-mt-sm">
            <div>{{ $t('Available balance') }}:</div>
            <b>{{ prettyNumber(balance.available_balance_sum, 3) }} BIP</b>
            <span class="text-grey-7" v-if="balance && balance.available_balance_sum_usd && language === 'en-us'">
              (~ {{ prettyNumber(balance.available_balance_sum_usd, 2) }} usd)
            </span>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-actions align="around">
          <q-btn @click="copyAddress" flat>{{ $t('Copy address') }}</q-btn>
          <q-btn @click="qrAddress = true" flat>{{ $t('Show QR') }}</q-btn>
        </q-card-actions>
      </q-card> -->

      <q-item-label header>{{ $t('Wallets') }}</q-item-label>
      <q-card>
        <q-list separator class="q-mb-md">
          <WalletItem v-for="(item, index) in walletsSelect" :key="index" :wallet="item" />
          <!-- <q-item v-ripple clickable v-for="(item, index) in walletsSelect" :key="index" @click="selectWallet(item.address)">
            <q-item-section top avatar class="q-ml-none">
              <q-avatar text-color="green" rounded>
                <q-icon name="check_circle" color="green" size="1rem" v-if="item.address === address" class="wallet__active-icon" />
                <q-img v-if="item.icon" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                  <template v-slot:error>
                    <div class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                  </template>
                </q-img>
                <q-icon v-else name="person" color="grey" size="2rem" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1" v-html="item.label"></q-item-label>
              <q-item-label caption lines="1">{{ item.caption }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <BalanceValue :address="item.address" />
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-card>
    </div>

    <q-item-label header>{{ $t('Services') }}</q-item-label>
    <div class="row q-mb-lg">
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/convert">
          <div><q-icon name="compare_arrows" size="2rem" class="text-white" /></div>
          {{ $t('Convert coins') }}
        </q-btn>
      </div>
      <div class="col-md-6 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/contacts">
          <div><q-icon name="supervisor_account" size="2rem" class="text-white" /></div>
          {{ $t('Contacts') }}
        </q-btn>
      </div>
      <div class="col-md-6 col-xs-12 q-pa-xs">
        <AddWallet />
      </div>
    </div>

    <q-dialog v-model="qrAddress">
      <q-card>
        <img class="address__qr" :src="qrImg" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
// import nacl from 'tweetnacl'
import QRCode from 'qrcode'
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
      qrImg: '',
      currentWallet: null
    }
  },
  created () {
    this.currentWallet = this.findWallet(this.address)
    this.createQR()
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
    createQR () {
      const opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        rendererOpts: {
          quality: 5
        }
      }
      QRCode.toDataURL(this.address, opts).then(url => {
        this.qrImg = url
      }).catch(err => {
        this.$q.notify({
          message: err,
          color: 'purple'
        })
        // console.error(err)
      })
    },
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
      'delegationsSum',
      'walletsSelect',
      'findWallet'
      // 'balanceObj',
      // 'coinsInfo'
    ])
  }
}
</script>
