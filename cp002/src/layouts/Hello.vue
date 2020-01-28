<template>
  <q-layout view="hhh lpr fff">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          {{ `${ $t('Hello') }, ${ username }` }}
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

      <div class="text-center q-pb-lg q-pt-lg"  v-if="total_balance_sum">
        <q-icon name="card_giftcard" size="48px" color="red"></q-icon>
        <p class="text-h5 q-pt-sm">{{ from }} {{ $t('sent you') }}</p>
        <div class="text-h4"><b>{{ total_balance_sum }} BIP</b></div>
        <div class="text-h5 text-grey-6" v-if="language === 'en-us'">~ {{ total_balance_sum_usd }} usd</div>
        <div class="text-h5 text-grey-6" v-if="language === 'ru'">~ {{ total_balance_sum_rub }} rub</div>
        <div class="q-pt-sm"><a href="https://www.minter.network/ru" target="_blank">{{ $t('What is it') }}?</a></div>
      </div>

      <div class="text-center text-h5 q-pb-sm">{{ $t('With this you can') }}</div>
      <services-list></services-list>
      <div class="text-center text-h5 q-pt-lg q-pb-xs">{{ $t('or send to someone else') }}</div>
      <send></send>
    </q-page>
    <!-- <router-view></router-view> -->
    </q-page-container>
  </q-layout>
</template>

<style>
  .fast {
    animation-duration : 0.15s;
  }
</style>

<script>
import ServicesList from '../components/ServicesList.vue'
import Send from '../pages/Send.vue'
import { mapState } from 'vuex'
import { wordlists } from 'bip39'
import { isValidMnemonic, walletFromMnemonic } from 'minterjs-wallet'
import { prettyNumber } from '../utils'
// import Big from 'big.js'

export default {
  name: 'Hello',
  components: {
    'services-list': ServicesList,
    'send': Send
  },
  data () {
    return {
      username: this.$t('lucky'),
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
      // language: this.$i18n.locale,
      mnemonic: '',
      action: 'sent',
      wallet: null,
      balance: null,
      total_balance_sum: null,
      total_balance_sum_usd: null,
      total_balance_sum_rub: null
    }
  },
  methods: {
    prettyNumber (x, l) {
      return prettyNumber(x, l)
    }
  },
  created () {
    console.log(this.$route.query)
    if (this.$route.query.username && this.$route.query.username !== '') this.username = this.$route.query.username
    if (this.$route.query.from && this.$route.query.from !== '') this.from = this.$route.query.from
    if (this.$route.query.action && this.$route.query.action !== '') this.action = this.$route.query.action
    if (this.username === '' || this.username === undefined) this.username = this.$t('lucky')
    if (this.from === '' || this.from === undefined) this.from = this.$t('Your friend')

    if (this.$route.query.key && this.$route.query.key !== '') {
      this.mnemonic = this.$route.query.key.split('.').map(n => wordlists.english[n]).join(' ')
      console.log(isValidMnemonic(this.mnemonic))
      if (isValidMnemonic(this.mnemonic)) {
        this.wallet = walletFromMnemonic(this.mnemonic)
        let address = this.wallet.getAddressString()
        this.$store.dispatch('FETCH_BALANCE_ADDRESS', address).then(data => {
          this.balance = data
          this.total_balance_sum = prettyNumber(data.total_balance_sum, 3)
          this.total_balance_sum_usd = prettyNumber(data.total_balance_sum_usd, 2)
          this.total_balance_sum_rub = prettyNumber(data.total_balance_sum_usd * this.currency['USDRUB'], 2)
        })
      }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.request.currency
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
