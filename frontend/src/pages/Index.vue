<template>
  <q-page padding>
    <q-card flat bordered class="q-mb-lg q-mt-sm">
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
    </q-card>

    <!--div v-if="false">
      <q-card v-if="!isRegistered">
        <q-card-section class="bg-purple text-white">
          <div class="text-h6">{{ $t('You are not registered in the Authenticator') }}</div>
          <div>{{ $t('Authenticator Registration text') }}</div>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn :disabled="balancesJSON['BIP'] <= signFee" @click="registerAddress" flat>{{ $t('Sign in') }}</q-btn>
        </q-card-actions>
      </q-card>
    </div-->
    <div class="row q-mb-lg">
      <div class="col-md-3 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/convert">
          <div><q-icon name="compare_arrows" size="2rem" class="text-white" /></div>
          {{ $t('Convert coins') }}
        </q-btn>
      </div>
      <div class="col-md-3 col-xs-6 q-pa-xs">
        <q-btn push stack class="bg-light-blue-14 text-white full-width q-pb-sm" to="/contacts">
          <div><q-icon name="supervisor_account" size="2rem" class="text-white" /></div>
          {{ $t('Contacts') }}
        </q-btn>
      </div>
      <div class="col-12 q-pa-xs">
      <!-- <div class="col-md-3 col-xs-6 q-pa-xs"> -->
        <AddWallet />
      </div>
    </div>
    <!-- <q-list>
      <q-item-label header>{{ $t('Coins') }}</q-item-label>
      <q-item to="/convert" clickable v-ripple>
        <q-btn size="16px" icon="compare_arrows" class="bg-secondary text-white full-width" flat :label="$t('Convert coins')" />
      </q-item>
      <q-item to="/contacts" clickable v-ripple>
        <q-btn size="16px" icon="supervisor_account" class="bg-secondary text-white full-width" flat :label="$t('Contacts')" />
      </q-item>
      <q-item to="/services" clickable v-ripple>
        <q-btn size="16px" icon="star" class="bg-secondary text-white full-width" flat :label="$t('Services')" />
      </q-item>
    </q-list> -->

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
// nacl.util = require('tweetnacl-util')

export default {
  name: 'Index',
  components: {
    AddWallet
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
      'findWallet'
      // 'balanceObj',
      // 'coinsInfo'
    ])
  }
}
</script>
<style>
  .address__qr {
    min-width: 300px;
  }
</style>
