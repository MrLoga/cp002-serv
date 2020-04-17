<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">
            {{ $t('My Address') }} <span class="text-grey-7">({{ address.substr(0,4) + "..." + address.substr(-4) }})</span>
          </div>
          <div v-if="balances && balances.available_balance_sum" class="text-subtitle1">
            <div>{{ $t('Available balance') }} {{ prettyNumber(balances.available_balance_sum, 3) }} BIP</div>
            <span class="text-grey-7" v-if="balances && balances.available_balance_sum_usd && language === 'ru'">
              (~ {{ prettyNumber(balances.available_balance_sum_usd * currency['USDRUB'], 2) }} руб)
            </span>
            <span class="text-grey-7" v-if="balances && balances.available_balance_sum_usd && language === 'en-us'">
              (~ {{ prettyNumber(balances.available_balance_sum_usd, 2) }} usd)
            </span>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-actions align="around">
          <q-btn @click="copyAddress" flat>{{ $t('Copy address') }}</q-btn>
          <q-btn @click="qrAddress = true" flat>{{ $t('Show QR') }}</q-btn>
        </q-card-actions>
      </q-card>

      <div v-if="false">
        <q-card v-if="!isRegistered">
          <q-card-section class="bg-purple text-white">
            <div class="text-h6">{{ $t('You are not registered in the Authenticator') }}</div>
            <div>{{ $t('Authenticator Registration text') }}</div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn :disabled="balancesJSON['BIP'] <= signFee" @click="registerAddress" flat>{{ $t('Sign in') }}</q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <q-list>
        <q-item-label header>{{ $t('Coins') }}</q-item-label>

        <q-item to="/convert" clickable v-ripple>
          <q-btn size="16px" icon="compare_arrows" class="bg-secondary text-white full-width" flat :label="$t('Convert coins')" />
        </q-item>
        <q-item to="/contacts" clickable v-ripple>
          <q-btn size="16px" icon="supervisor_account" class="bg-secondary text-white full-width" flat :label="$t('Send to people')" />
        </q-item>
        <q-item to="/services" clickable v-ripple>
          <q-btn size="16px" icon="star" class="bg-secondary text-white full-width" flat :label="$t('Services')" />
        </q-item>
      </q-list>
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
import nacl from 'tweetnacl'
import QRCode from 'qrcode'
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE_SEND } from 'minterjs-tx'
import { prettyNumber } from '../utils'
nacl.util = require('tweetnacl-util')

export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      language: this.$i18n.locale,
      qrAddress: false,
      qrImg: ''
    }
  },
  computed: {
    ...mapState({
      privateKey: state => state.wallet.privateKey,
      address: state => state.wallet.address,
      key: state => state.wallet.key,
      nonce: state => state.wallet.nonce,
      currency: state => state.request.currency,
      balances: state => state.api.balances,
      balancesJSON: state => state.api.balancesJSON,
      delegations: state => state.api.delegations
    }),
    ...mapGetters([
      'isLogin',
      'isRegistered',
      'balanceSum',
      'balanceCustom',
      'delegationsSum'
    ])
  },
  methods: {
    registerAddress () {
      this.$store.dispatch('REGISTER_ADDRESS')
    },
    getAddress () {
      this.$store.dispatch('GET_ADDRESS')
    },
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
    },
    signFee () {
      return getFeeValue(TX_TYPE_SEND, { payload: 'MX4qptIH0mXijR8XlroE56txuOeyig==' })
    }
  },
  created () {
    this.createQR()
  }
}
</script>
<style>
  .address__qr {
    min-width: 300px;
  }
</style>
