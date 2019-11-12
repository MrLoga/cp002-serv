<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">My Address</div>
          <div v-if="balances && balances.available_balance_sum" class="text-subtitle1">Available balance {{ numberSpaces(pretty(balances.available_balance_sum, 3)) }} BIP</div>
          <div class="text-subtitle1">{{ address }}</div>
        </q-card-section>

        <q-separator inset />

        <q-card-actions align="around">
          <q-btn @click="copyAddress" flat>Copy address</q-btn>
          <q-btn @click="qrAddress = true" flat>Show QR</q-btn>
        </q-card-actions>
      </q-card>

      <q-card v-if="!isRegistered">
        <q-card-section class="bg-purple text-white">
          <div class="text-h6">You are not registered in the CP002</div>
          <div>Registration is free, but you must have at least 0.01 bip on your balance to pay network commission</div>
        </q-card-section>

        <q-card-actions align="around">
          <q-btn :disabled="balancesJSON['BIP'] <= signFee" @click="registerAddress" flat>Sign in</q-btn>
        </q-card-actions>
      </q-card>
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
import { pretty, numberSpaces } from '../utils'
nacl.util = require('tweetnacl-util')

export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
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
    pretty (val, l) { return pretty(val, l) },
    numberSpaces (val) { return numberSpaces(val) },
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
          message: 'Address copied',
          color: 'purple'
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
