<template>
  <q-layout view="hhh lpr fff">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          CP002 Wallet β
        </q-toolbar-title>

        <q-btn round color="secondary" :label="language.substr(0,2)" @click="alertLang = true"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
    <q-page>
      <q-dialog v-model="alertLang">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="text-h6">{{ $t('Choose a language') }}</div>
          </q-card-section>

          <q-card-section>
            <q-list>
              <q-item tag="label" v-ripple v-for="lang in languageList" :key="lang.value">
                <q-item-section avatar>
                  <q-radio v-model="language" :val="lang.value" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ lang.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="text-center">
        <div class="text-h4 q-mt-lg q-mb-lg q-pt-lg">{{ $t('Now this is your new wallet') }}</div>
        <q-btn @click="authSeed" color="primary" size="1.2em" :label="$t('Start using')" />
        <div>
          <q-icon name="card_giftcard" class="q-mt-lg" size="48px" color="positive"></q-icon>
        </div>
      </div>
    </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import { wordlists } from 'bip39'
import { isValidMnemonic, walletFromMnemonic } from 'minterjs-wallet'
import { prettyNumber } from '../utils'

export default {
  name: 'Hello',
  data () {
    return {
      key: '',
      alertLang: false,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ],
      mnemonic: '',
      wallet: null,
      total_balance_sum: null,
      total_balance_sum_usd: null,
      total_balance_sum_rub: null
    }
  },
  methods: {
    prettyNumber (x, l) {
      return prettyNumber(x, l)
    },
    authSeed () {
      this.walletLogin()
      this.$router.push({ path: '/' })
    },
    walletLogin: function () {
      const walletData = {
        address: this.wallet.getAddressString(),
        publicKey: this.wallet.getPublicKeyString(),
        privateKey: this.wallet.getPrivateKeyString(),
        mnemonic: this.wallet.getMnemonic()
      }
      this.$store.commit('SAVE_WALLET', walletData)
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_COINS')
      this.$store.dispatch('FETCH_VALIDATORS')
      this.$store.dispatch('FETCH_DELEGATION')
    }
  },
  created () {
    if (this.$route.query.key && this.$route.query.key !== '') {
      this.mnemonic = this.$route.query.key.split('.').map(n => wordlists.english[n]).join(' ')
      console.log(isValidMnemonic(this.mnemonic))
      if (isValidMnemonic(this.mnemonic)) {
        this.wallet = walletFromMnemonic(this.mnemonic)
        const address = this.wallet.getAddressString()
        this.$store.commit('PUSH_DATA', {
          mnemonic: this.mnemonic,
          address: address
        })
        this.$store.dispatch('FETCH_BALANCE_ADDRESS', address).then(data => {
          this.$store.commit('PUSH_BALANCE', data)
          this.total_balance_sum = prettyNumber(data.total_balance_sum, 3)
          this.total_balance_sum_usd = prettyNumber(data.total_balance_sum_usd, 2)
          this.total_balance_sum_rub = prettyNumber(data.total_balance_sum_usd * this.currency.USDRUB, 2)
        })
      }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.request.currency,
      balances: state => state.push.balances
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    }
  },
  watch: {
  }
}
</script>
