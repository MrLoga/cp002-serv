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
            <span class="q-ml-xs text-grey-7" v-if="currency && currency.usd">({{ Big(balanceData.available_balance_sum).times(currency.usd).round(2, 3).toString() }} $)</span>
          </div>
          <div>
            Delegated: <b class="q-ml-sm">{{ prettyNumber(delegationsData.meta.additional.total_delegated_bip_value, 2) }}</b> bip
            <span class="q-ml-xs text-grey-7" v-if="currency && currency.usd">({{ Big(delegationsData.meta.additional.total_delegated_bip_value).times(currency.usd).round(2, 3).toString() }} $)</span>
          </div>
        </div>
        <div v-else>
          <q-skeleton type="text" />
          <q-skeleton type="text" />
        </div>
      </div>

      <div v-if="!wallet.privateKey && !isObserve" class="text-center q-pa-md">
        <q-btn label="Add seed phrase" icon="lock" color="negative" @click="addMnemonicDialog = true" />
      </div>
      <q-dialog v-model="addMnemonicDialog" transition-show="scale" transition-hide="scale">
        <q-card class="dialog-min300">
          <form @submit.prevent.stop="saveMnemonicWallet" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="addMnemonic"
                outlined
                clearable
                spellcheck="false"
                autogrow
                :label="$t('Mnemonic')"
                :error="addMnemonicIsError"
                :error-message="addMnemonicErrorMsg"
              />
              <div>
                <q-btn type="submit" class="full-width" :label="$t('Add mnemonic phrase')" color="primary" :disabled="!addMnemonic || !addMnemonic.length" />
              </div>
            </q-card-section>
          </form>
        </q-card>
      </q-dialog>

      <q-separator inset />
      <q-card-actions align="center">
        <q-btn flat round color="teal" @click="qrAddressDialog = true">
          <q-icon size="sm">
            <img style="max-width: 92%" src="statics/qr-icon_black.svg" />
          </q-icon>
        </q-btn>
        <q-btn flat round color="teal" icon="file_copy" @click="copyAddress" />
        <q-btn flat round color="primary" icon="share" v-if="shareTest()" @click="shareAddress" />
        <!-- <q-btn flat round color="purple" icon="format_list_bulleted" to="/transactions" /> -->
        <q-btn flat round color="purple" icon="settings" @click="settingWalletDialog = true" />
        <!-- <q-btn flat round color="purple" icon="settings" v-if="!isObserve" @click="settingWalletDialog = true" />
        <q-btn flat round color="deep-orange-14" icon="delete" v-else @click="removeObserveDialog = true" /> -->
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

          <q-item v-if="wallet.privateKey" v-ripple clickable @click="settingWalletDialog = false; showSeedDialog = true">
            <q-item-section avatar>
              <q-icon color="orange" name="visibility" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Show seed phrase') }}</q-item-label>
              <q-item-label caption>{{ $t('Keep it secret') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else v-ripple clickable @click="settingWalletDialog = false; addMnemonicDialog = true">
            <q-item-section avatar>
              <q-icon color="orange" name="visibility" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Add mnemonic phrase') }}</q-item-label>
              <q-item-label caption>{{ $t('Keep it secret') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />

          <q-item v-if="!isObserve" v-ripple clickable @click="settingWalletDialog = false; logoutDialog = true">
            <q-item-section avatar>
              <q-icon color="deep-orange-14" name="delete" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ $t('Logout this wallet') }}</q-item-label>
              <q-item-label caption>{{ $t('Data about wallet will be deleted') }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else v-ripple clickable @click="settingWalletDialog = false; removeObserveDialog = true">
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
        <q-list v-if="balanceData && balanceData.balances.length">
          <q-item v-for="(item, index) in balanceData.balances" :key="index" class="q-pl-none q-pr-none">
            <q-item-section avatar>
              <q-avatar :style="`background-color: ${ stringToHSL(item.coin) }`" class="balance__coin-avatar" text-color="white">
                <span class="balance__coin-letter">{{ item.coin.charAt(0).toUpperCase() }}</span>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">{{ item.coin }}</q-item-label>
              <q-item-label v-if="coinsInfo && coinsInfo[item.coin]" caption lines="1">{{ coinsInfo[item.coin].name }}</q-item-label>
            </q-item-section>

            <q-item-section side class="text-grey-9">
              <b>{{ prettyNumber(item.amount, 4) }}</b>
              <div class="text-caption text-grey-7 text-weight-medium" v-if="item.coin !== 'BIP'">
                {{ coinsCost(item.amount, item.coin) }} bip
              </div>
              <div class="text-caption text-grey-7 text-weight-medium" v-else>Base coin</div>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="3em"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="delegations" class="q-pl-none q-pr-none">
        <div class="delegations" v-if="delegationsGroup && delegationsData.data.length">
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
              <q-item-section side v-if="!isObserve">
                <q-btn size="1rem" flat color="light-blue-14" dense round icon="add_circle_outline" @click="$router.push({ name: 'send', params: { import: { address: item[0].pub_key } } })" />
              </q-item-section>
            </q-item>
            <q-separator inset class="q-mb-sm" />
            <q-item v-for="coin in item" :key="coin.coin" class="q-mb-xs">
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
                  <span v-if="coin.bip_value">/ {{ prettyNumber(coin.bip_value, 0) }}</span>
                  bip
                </div>
                <div class="text-caption text-grey-7 text-weight-medium" v-else>Base coin</div>
              </q-item-section>
              <q-item-section side class="text-grey-9" v-if="!isObserve && coin.type !== 'unbond'">
                <q-btn size="1rem" flat color="grey-6" dense round icon="remove_circle_outline" @click="unbondOpen(item[0].pub_key, coin.coin, coin.value)" />
              </q-item-section>
              <q-item-section side class="text-grey-9" v-if="!isObserve && coin.type && coin.type === 'unbond'">
                <div class="text-caption text-grey-7 text-weight-medium">{{ coin.days }} days</div>
                <div class="text-caption text-grey-7 text-weight-medium">{{ coin.hours }} hours</div>
              </q-item-section>
              <q-item-section side class="text-grey-9 text-center" v-if="!isObserve && coin.type && coin.type === 'unbond'">
                <q-spinner-ios style="margin: 0 auto" color="text-grey-9" size="1.5em" />
                <div class="text-caption text-grey-7 text-weight-medium">{{ $t('Unbonding') }}</div>
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
    <q-dialog v-model="unbondDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;" v-if="unbondDialogData">
        <q-item class="q-mb-xs" v-if="unbondDialogData.validator">
          <q-item-section avatar>
            <q-avatar>
              <img :src="unbondDialogData.validator.meta.icon_url">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold" lines="1">{{ unbondDialogData.validator.meta.name }}</q-item-label>
            <q-item-label caption lines="1">{{ unbondDialogData.validator.meta.description }}</q-item-label>
          </q-item-section>
        </q-item>
        <div class="text-h6 text-center q-mt-sm">{{ prettyNumber(unbondDialogData.value, 2) }} {{ unbondDialogData.coin }}</div>
        <div class="text-caption text-center text-grey-7 q-mt-sm">Unbond commision: 0.2 bip</div>
        <q-separator class="q-mt-md q-mb-xs" />
        <q-card-actions>
          <q-btn flat dense :label="$t('Cancel')" color="primary" v-close-popup />
          <q-space />
          <q-btn flat dense :label="$t('Make unbond')" color="red-10" @click="unbondSend" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { stringToHSL, prettyNumber } from '../utils'
import { copyToClipboard } from 'quasar'
import { isValidMnemonic, walletFromMnemonic } from 'minterjs-wallet'
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
      isObserve: false,
      balanceData: null,
      delegationsData: null,
      delegationsGroup: null,
      editWalletDialog: false,
      newTitle: false,
      removeObserveDialog: false,
      qrAddressDialog: false,
      unbondDialog: false,
      unbondDialogData: null,
      qrImg: '',
      addMnemonic: null,
      addMnemonicDialog: false,
      addMnemonicIsError: null,
      addMnemonicErrorMsg: null,
      settingWalletDialog: false,
      showSeedDialog: false,
      logoutDialog: false,
      balanceTab: 'balance'
    }
  },
  created () {
    this.init(this.address)
  },
  methods: {
    Big: (val) => Big(val),
    prettyNumber: (val, l) => prettyNumber(val, l),
    stringToHSL: str => stringToHSL(str),
    init (address, update) {
      this.balanceData = null
      this.delegationsData = null
      this.delegationsGroup = null
      if (!update && this.obsAddress && this.obsAddress.length === 42) {
        this.isObserve = true
        const currentWallet = this.observerSelect.findIndex(item => item.address === this.obsAddress)
        if (currentWallet !== -1) {
          this.wallet = this.observerSelect[currentWallet]
          this.newTitle = this.wallet.title
        } else {
          const profile = this.findUser(this.obsAddress)
          this.newTitle = profile.title
        }
      } else {
        this.isObserve = false
        const currentWallet = this.walletsSelect.findIndex(item => item.address === address)
        this.wallet = this.walletsSelect[currentWallet]
        this.newTitle = this.wallet.title
      }
      this.getBalance(this.wallet.address)
      this.getDelegations(this.wallet.address)
      this.createQR()
    },
    async saveMnemonicWallet () {
      if (isValidMnemonic(this.addMnemonic)) {
        const tmpWallet = walletFromMnemonic(this.addMnemonic)
        const walletData = {
          address: tmpWallet.getAddressString(),
          privateKey: tmpWallet.getPrivateKeyString(),
          mnemonic: tmpWallet.getMnemonic()
        }
        if (walletData.address === this.wallet.address) {
          const profile = this.findProfile(walletData.address)
          walletData.title = this.wallet.title
          walletData.icon = profile ? profile.icon : ''
          await this.$store.dispatch('REMOVE_OBSERVER', walletData.address)
          await this.$store.dispatch('SAVE_WALLET', walletData)
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.dispatch('FETCH_DELEGATION')
        } else {
          this.addMnemonicIsError = true
          this.addMnemonicErrorMsg = this.$t('This is the mnemonic for another address')
        }
      } else {
        this.addMnemonicIsError = true
        this.addMnemonicErrorMsg = this.$t('Invalid mnemonic')
      }
    },
    unbondOpen (pubKey, coin, value) {
      this.unbondDialogData = {
        validator: this.findValidator(pubKey),
        pubKey,
        coin,
        value
      }
      this.unbondDialog = true
      console.log(this.unbondDialogData)
    },
    unbondSend () {
      const txParams = {
        type: 'UNBOND',
        data: {
          publicKey: this.unbondDialogData.pubKey,
          coin: this.unbondDialogData.coin,
          stake: this.unbondDialogData.value
        },
        gasCoin: 'BIP'
      }
      this.$store.dispatch('SENDER', txParams).then(txHash => {
        this.unbondDialog = false
        this.$store.commit('SET_UNBOND', {
          pub_key: txParams.data.publicKey,
          value: txParams.data.stake,
          coin: txParams.data.coin,
          validator_meta: { name: this.unbondDialogData.validator.meta.name },
          address: this.address
        })
        this.$q.notify({
          message: this.$t('Transaction successful') + '. Сoins return in about 30 days',
          icon: 'tag_faces',
          color: 'teal',
          position: 'bottom'
        })
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative',
          position: 'bottom'
        })
      })
    },
    shareTest () {
      if (navigator.share) return true
      else return false
    },
    coinsCost (value, coin) {
      if (!this.coinsInfo[coin] || !this.coinsInfo[coin].volume) return 'Error'
      const info = this.coinsInfo[coin]
      const times = 1 - (Math.pow(1 - (value / info.volume), (100 / info.crr)))
      return Big(info.reserve).times(times).round(1, 0).toString()
    },
    async getBalance (address) {
      this.balanceData = await this.$store.dispatch('FETCH_BALANCE_ADDRESS', this.wallet.address)
    },
    async getDelegations (address) {
      // this.$store.commit('REMOVE_UNBOND')
      this.delegationsGroup = null
      this.delegationsData = null
      const loadDelegations = await this.$store.dispatch('FETCH_DELEGATIONS_ADDRESS', this.wallet.address)
      let tmpDelegations
      if (this.unbond[this.wallet.address]) {
        const unbondList = this.unbond[this.wallet.address].map(unbondItem => {
          const validator = this.findValidator(unbondItem.pub_key)
          const tmpItem = Object.assign({}, unbondItem)
          const time = Big(518400).minus(this.status.latestBlockHeight - tmpItem.height).times(this.status.averageBlockTime).round(0, 0).toString()
          tmpItem.days = Big(time).div(86400).round(0, 0)
          tmpItem.hours = Big(time).minus(Big(tmpItem.days).times(86400)).div(3600).round(0, 0).toString()
          tmpItem.validator_meta = validator.meta
          tmpItem.bip_value = false
          return tmpItem
        })
        tmpDelegations = loadDelegations.data.filter(item => {
          if (this.unbond && unbondList) {
            const delegate = unbondList.findIndex(unbondItem => unbondItem.pub_key === item.pub_key && unbondItem.coin === item.coin && unbondItem.value === item.value)
            // console.log(delegate)
            return (delegate < 0)
          } else return true
        })
        tmpDelegations = tmpDelegations.concat(unbondList)
      } else {
        tmpDelegations = loadDelegations.data
      }

      const arrDelegations = tmpDelegations.map(item => {
        if (item.coin !== 'BIP') {
          item.bip_cost = this.coinsCost(item.value, item.coin)
        } else item.bip_cost = 0
        return item
      })
      this.delegationsData = loadDelegations
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
      QRCode.toDataURL(this.wallet.address, opts).then(url => {
        this.qrImg = url
      }).catch(err => {
        this.$q.notify({
          message: err,
          color: 'purple'
        })
        // console.error(err)
      })
    },
    dataURItoBlob (dataURI) {
      const byteString = atob(dataURI.split(',')[1])
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      return blob
    },
    shareAddress () {
      const file = this.dataURItoBlob(this.qrImg)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          text: this.wallet.address
        })
          .then(() => console.log('Share was successful.'))
          .catch((error) => console.log('Sharing failed', error))
      } else {
        navigator.share({
          text: this.wallet.address
        })
          .then(() => console.log('Successful share'))
          .catch(error => console.log('Error sharing', error))
      }
    },
    saveNewTitle () {
      if (this.newTitle) {
        this.$store.dispatch('CHANGE_NAME_WALLET', { title: this.newTitle, address: this.wallet.address, isObserve: this.isObserve })
        this.wallet.title = this.newTitle
      } else {
        this.$store.dispatch('CHANGE_NAME_WALLET', { title: 'No name', address: this.wallet.address, isObserve: this.isObserve })
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
      this.$store.dispatch('REMOVE_WALLET', this.wallet.address)
      if (this.walletsSelect && this.walletsSelect[0]) {
        this.wallet = this.walletsSelect[0]
        this.$store.commit('SET_WALLET', this.wallet.address)
        this.$store.dispatch('FETCH_BALANCE')
        this.$store.dispatch('FETCH_DELEGATION')
      } else {
        this.$store.commit('SET_WALLET', null)
      }
      this.$router.push({ path: '/' })
    },
    removeObserver () {
      this.removeObserveDialog = false
      this.$store.dispatch('REMOVE_OBSERVER', this.wallet.address)
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      currency: state => state.api.currency,
      balance: state => state.api.balance,
      delegations: state => state.api.delegations,
      status: state => state.api.status,
      unbond: state => state.api.unbond,
      delegationsTotal: state => state.api.delegationsTotal
    }),
    ...mapGetters([
      'balanceObj',
      // 'delegationsGroup',
      'coinsInfo',
      'delegationsSum',
      'observerSelect',
      'walletsSelect',
      'findValidator',
      'findWallet',
      'findProfile',
      'findUser'
    ])
  },
  beforeRouteUpdate (to, from, next) {
    if (to.obsAddress === undefined) {
      this.init(this.address, true)
    } else {
      this.init(to.obsAddress, true)
    }
    next()
  },
  watch: {
    address (val) {
      if (val) {
        this.init(val, true)
      } else {
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>
