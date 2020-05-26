<template>
  <q-page padding>
    <!-- <div class="text-grey-7 q-mt-lg">{{ $t('Current wallet') }}</div> -->
    <q-card v-if="wallet" flat bordered class="q-mb-lg q-mt-sm">

      <div class="q-pa-md">
        <div class="text-h5">{{ wallet.title }}</div>
        <div class="text-caption text-grey-7">{{ wallet.address }}</div>

        <q-separator class="q-mb-sm q-mt-sm" />

        <div v-if="balanceData && delegationsData">
          <div>
            Available balance: <b class="q-ml-sm">{{ prettyNumber(balanceData.available_balance_sum, 2) }}</b> bip
            <span class="q-ml-xs text-grey-7">({{ Big(balanceData.available_balance_sum).times(currency.usd).round(2, 3).toString() }} $)</span>
          </div>
          <div>
            Delegated: <b class="q-ml-sm">{{ prettyNumber(delegationsData.meta.additional.total_delegated_bip_value, 2) }}</b> bip
            <span class="q-ml-xs text-grey-7">({{ Big(delegationsData.meta.additional.total_delegated_bip_value).times(currency.usd).round(2, 3).toString() }} $)</span>
          </div>
        </div>
        <div v-else>
          <q-skeleton type="text" />
          <q-skeleton type="text" />
        </div>

      </div>

      <q-separator inset />
      <q-card-actions align="center">
        <q-btn flat round color="teal" @click="qrAddressDialog = true">
          <q-icon size="sm">
            <img style="max-width: 92%" src="statics/qr-icon_black.svg" />
          </q-icon>
        </q-btn>
        <q-btn flat round color="teal" icon="file_copy" @click="copyAddress" />
        <q-btn flat round color="primary" icon="share" v-if="shareTest()" @click="shareAddress" />
        <q-btn flat round color="purple" icon="format_list_bulleted" to="/transactions" />
        <q-btn flat round color="purple" icon="settings" v-if="!obsAddress || obsAddress.length !== 42" @click="settingWalletDialog = true" />
        <q-btn flat round color="deep-orange-14" icon="delete" v-else @click="removeObserveDialog = true" />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="qrAddressDialog">
      <q-card>
        <img class="address__qr" :src="qrImg" />
      </q-card>
    </q-dialog>
    <q-dialog v-model="settingWalletDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <q-list>

          <q-item-label header class="q-pb-sm">{{ $t('Wallet settings') }}</q-item-label>
          <q-separator />
          <q-item v-ripple clickable @click="settingWalletDialog = false; editWalletDialog = true">
            <q-item-section avatar>
              <q-icon color="teal" name="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Change name') }}</q-item-label>
              <!-- <q-item-label caption>{{ $t('Keep it secret') }}</q-item-label> -->
            </q-item-section>
          </q-item>
          <q-separator inset />

          <q-item v-ripple clickable @click="settingWalletDialog = false; showSeedDialog = true">
            <q-item-section avatar>
              <q-icon color="orange" name="visibility" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Show seed phrase') }}</q-item-label>
              <q-item-label caption>{{ $t('Keep it secret') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />

          <q-item v-ripple clickable @click="settingWalletDialog = false; logoutDialog = true">
            <q-item-section avatar>
              <q-icon color="deep-orange-14" name="delete" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Logout this wallet') }}</q-item-label>
              <q-item-label caption>{{ $t('Data about wallet will be deleted') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editWalletDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
        <div>
          <q-input
            v-model="newTitle"
            outlined
            clearable
            spellcheck="false"
            bg-color="white"
          />
        </div>
        <q-separator class="q-mt-md q-mb-xs" />
        <q-card-actions>
          <q-btn flat dense :label="$t('Cancel')" color="primary" v-close-popup />
          <q-space />
          <q-btn flat dense :label="$t('Save')" color="teal" @click="saveNewTitle" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showSeedDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
        <div class="text-subtitle1">{{ wallet.mnemonic }}</div>
        <q-separator class="q-mt-md q-mb-xs" />
        <q-card-actions>
          <q-btn flat dense :label="$t('Cancel')" color="primary" v-close-popup />
          <q-space />
          <q-btn flat dense :label="$t('Copy')" color="teal" @click="copyMnemonic" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="logoutDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
        <div class="text-h6 text-center">{{ $t('Attention') }}</div>
        <div class="text-subtitle2 text-center">{{ $t('Remove wallet text') }}</div>
        <q-separator class="q-mt-md q-mb-xs" />
        <q-card-actions>
          <q-btn flat dense :label="$t('Cancel')" color="primary" v-close-popup />
          <q-space />
          <q-btn flat dense :label="$t('Remove wallet')" color="red-10" @click="removeWallet" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeObserveDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
        <!-- <div class="text-h6 text-center">{{ $t('Attention') }}</div> -->
        <div class="text-subtitle2 text-center">{{ $t('Remove observer text') }}</div>
        <q-separator class="q-mt-md q-mb-xs" />
        <q-card-actions>
          <q-btn flat dense :label="$t('Cancel')" color="primary" v-close-popup />
          <q-space />
          <q-btn flat dense :label="$t('Remove observer')" color="red-10" @click="removeObserver" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-tabs
      v-model="balanceTab"
      inline-label
      active-color="white"
      indicator-color="grey-13"
      active-bg-color="light-blue-10"
      class="bg-light-blue-9 text-white"
    >
      <q-tab no-caps name="balance" :label="$t('Coins')" />
      <q-tab no-caps name="delegations" :label="$t('Delegations')" />
      <q-tab no-caps name="transactions" :label="$t('Transactions')" />
    </q-tabs>

    <q-tab-panels v-model="balanceTab" animated>
      <q-tab-panel name="balance">
        <q-list>
          <q-item v-for="(amount, coin) in balanceObj" :key="coin" class="q-pl-none q-pr-none">
            <q-item-section avatar>
              <q-avatar :style="`background-color: ${stringToHSL(coin)}`" class="balance__coin-avatar" text-color="white">
                <span class="balance__coin-letter">{{ coin.charAt(0).toUpperCase() }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{ coin }}</q-item-label>
              <q-item-label v-if="coinsInfo" caption lines="1">{{ coinsInfo[coin].name }}</q-item-label>
            </q-item-section>

            <q-item-section side class="text-grey-9">
              <b>{{ prettyNumber(amount, 4) }}</b>
              <div class="text-caption text-grey-7 text-weight-medium" v-if="coin !== 'BIP'">
                {{ coinsCost(amount, coin) }} bip
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="delegations" class="q-pl-none q-pr-none">
        <div class="delegations" v-if="delegationsData && delegationsData.data.length">
          <q-list v-for="(item, name) in delegationsGroup" :key="name">
            <q-item class="q-mb-xs">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="item[0].validator_meta.icon_url">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold" lines="1">{{ item[0].validator_meta.name }}</q-item-label>
                <q-item-label caption lines="1">{{ item[0].validator_meta.description }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="!obsAddress || obsAddress.length !== 42">
                <q-btn size="1rem" flat color="light-blue-14" dense round icon="add_circle_outline" @click="$router.push({ name: 'send', params: { import: { address: item[0].pub_key } } })" />
              </q-item-section>
            </q-item>
            <q-separator inset class="q-mb-sm" />
            <q-item dense v-for="coin in item" :key="coin.coin" class="q-mb-xs">
              <q-item-section>
                <q-item-label class="text-grey-10" lines="1">
                  <b>{{ coin.coin }}</b>
                  <!-- <div class="text-caption text-grey-7 text-weight-medium" v-if="coin.coin !== 'BIP'">Cost</div> -->
                </q-item-label>
              </q-item-section>
              <q-item-section side class="text-grey-9">
                <b>{{ prettyNumber(coin.value, 5) }}</b>
                <div class="text-caption text-grey-7 text-weight-medium" v-if="coin.coin !== 'BIP'">
                  {{ prettyNumber(coin.bip_cost, 0) }}
                  <!-- {{ prettyNumber(Big(coin.bip_value).div(coinsInfo[coin.coin].crr).times(100).toString(), 0) }} bip -->
                  /
                  {{ prettyNumber(coin.bip_value, 0) }} bip
                </div>
              </q-item-section>
            </q-item>
            <q-separator color="grey-2" style="height: 1rem;" class="q-mt-xs" />
          </q-list>
        </div>
        <q-item-label v-else header>{{ $t('No delegations') }}</q-item-label>
      </q-tab-panel>
      <q-tab-panel name="transactions" class="q-pa-none transactions__wrap">
        <TransactionsList :address="wallet.address" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { stringToHSL, prettyNumber } from '../utils'
import { copyToClipboard } from 'quasar'
import QRCode from 'qrcode'
import Big from 'big.js'
import TransactionsList from '../components/TransactionsList.vue'

export default {
  name: 'Wallet',
  props: {
    obsAddress: String
  },
  components: {
    TransactionsList
  },
  data () {
    return {
      wallet: null,
      balanceData: null,
      delegationsData: null,
      delegationsGroup: null,
      editWalletDialog: false,
      newTitle: false,
      removeObserveDialog: false,
      qrAddressDialog: false,
      qrImg: '',
      settingWalletDialog: false,
      showSeedDialog: false,
      logoutDialog: false,
      balanceTab: 'balance'
    }
  },
  created () {
    if (this.obsAddress && this.obsAddress.length === 42) {
      const currentWallet = this.observerSelect.findIndex(item => item.address === this.obsAddress)
      if (currentWallet !== -1) {
        this.wallet = this.observerSelect[currentWallet]
        this.newTitle = this.wallet.title
      } else {
        const profile = this.findUser(this.obsAddress)
        this.newTitle = profile.title
      }
    } else {
      const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
      this.wallet = this.walletsSelect[currentWallet]
      this.newTitle = this.wallet.title
    }
    this.getBalance(this.wallet.address)
    this.getDelegations(this.wallet.address)
    this.createQR()
  },
  methods: {
    Big: (val) => Big(val),
    prettyNumber: (val, l) => prettyNumber(val, l),
    stringToHSL: str => stringToHSL(str),
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    coinsCost (value, coin) {
      const info = this.coinsInfo[coin]
      const times = 1 - (Math.pow(1 - (value / info.volume), (100 / info.crr)))
      return Big(info.reserve).times(times).round(1, 0).toString()
    },
    async getBalance (address) {
      this.balanceData = await this.$store.dispatch('FETCH_BALANCE_ADDRESS', this.wallet.address)
    },
    async getDelegations (address) {
      const tmpDelegations = await this.$store.dispatch('FETCH_DELEGATIONS_ADDRESS', this.wallet.address)
      const arrDelegations = tmpDelegations.data.map(item => {
        if (item.coin !== 'BIP') {
          item.bip_cost = this.coinsCost(item.value, item.coin)
        } else item.bip_cost = 0
        return item
      })
      console.log(arrDelegations)
      this.delegationsData = tmpDelegations
      console.log(this.delegationsData)
      this.delegationsGroup = arrDelegations.reduce((prev, curr) => {
        (prev[curr.validator_meta.name] = prev[curr.validator_meta.name] || []).push(curr)
        return prev
      }, {})
    },
    createQR () {
      const opts = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 400,
        margin: 1
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
    shareAddress () {
      navigator.share({
        url: this.wallet.address
      })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error))
    },
    saveNewTitle () {
      if (this.newTitle) {
        this.$store.commit('CHANGE_NAME_WALLET', { title: this.newTitle, address: this.address })
        this.wallet.title = this.newTitle
      } else {
        this.$store.commit('CHANGE_NAME_WALLET', { title: 'No name', address: this.address })
        this.wallet.title = 'No name'
      }
    },
    copyAddress () {
      copyToClipboard(this.wallet.address).then(() => {
        this.$q.notify({
          message: this.$t('Address copied'),
          color: 'purple',
          position: 'bottom',
          timeout: 400
        })
      }).catch(() => {})
    },
    copyMnemonic () {
      copyToClipboard(this.wallet.mnemonic).then(() => {
        this.$q.notify({
          message: this.$t('Seed phrase copied'),
          color: 'purple',
          position: 'bottom',
          timeout: 400
        })
      }).catch(() => {})
    },
    removeWallet () {
      this.logoutDialog = false
      this.$store.commit('REMOVE_WALLET', this.wallet.address)
      this.wallet = this.walletsSelect[0]
      this.$store.commit('SET_WALLET', this.wallet.address)
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')
    },
    removeObserver () {
      this.removeObserveDialog = false
      this.$store.commit('REMOVE_OBSERVER', this.wallet.address)
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      delegations: state => state.api.delegations,
      delegationsTotal: state => state.api.delegationsTotal
    }),
    ...mapGetters([
      'balanceObj',
      // 'delegationsGroup',
      'coinsInfo',
      'delegationsSum',
      'observerSelect',
      'walletsSelect',
      'findWallet',
      'findUser'
    ])
  },
  watch: {
    address (val) {
      const currentWallet = this.walletsSelect.findIndex(item => item.address === val)
      this.wallet = this.walletsSelect[currentWallet]
      this.newTitle = this.wallet.title
      this.createQR()
    }
  }
}
</script>
