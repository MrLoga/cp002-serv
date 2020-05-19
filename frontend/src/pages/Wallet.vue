<template>
  <q-page padding>
    <!-- <div class="text-grey-7 q-mt-lg">{{ $t('Current wallet') }}</div> -->
    <q-card v-if="wallet" flat bordered class="q-mb-lg q-mt-sm">

      <div class="q-pa-md">
        <div class="text-h5">{{ wallet.title }}</div>
        <div class="text-caption text-grey-7">{{ wallet.address }}</div>

        <q-separator class="q-mb-sm q-mt-sm" />

        <div>
          Available balance: <b class="q-ml-sm">{{ prettyNumber(balance.available_balance_sum, 2) }}</b> bip
          <span class="q-ml-xs text-grey-7">({{ prettyNumber(balance.available_balance_sum_usd, 2) }} $)</span>
        </div>
        <div>Delegated: <b class="q-ml-sm">{{ prettyNumber(delegationsTotal, 2) }}</b> bip</div>

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
        <q-btn flat round color="purple" icon="settings" @click="settingWalletDialog = true" />
      </q-card-actions>

      <!-- <q-list bordered>
        <q-item v-ripple clickable @click="copyAddress">
          <q-item-section avatar>
            <q-icon color="indigo" name="file_copy" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ $t('Copy address') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />

        <q-item v-if="shareTest()" v-ripple clickable @click="shareAddress">
          <q-item-section avatar>
            <q-icon color="blue" name="share" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ $t('Share address') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset v-if="shareTest()" />

        <q-item v-ripple clickable @click="settingWalletDialog = true">
          <q-item-section avatar>
            <q-icon color="blue-grey-14" size="1.7rem" name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ $t('Wallet settings') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list> -->
    </q-card>

    <q-dialog v-model="qrAddressDialog">
      <q-card>
        <img class="address__qr" :src="qrImg" />
      </q-card>
    </q-dialog>
    <q-dialog v-model="settingWalletDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <q-list>
          <!-- <q-item v-if="wallet && wallet.title">
            <q-item-section top avatar class="q-ml-none">
              <q-avatar text-color="primary">
                <q-img v-if="wallet.icon" :src="wallet.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                  <template v-slot:error>
                    <q-icon name="person" color="grey" size="2rem" />
                  </template>
                </q-img>
                <q-icon v-else name="person" color="grey" size="2rem" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1" class="text-bold">{{ wallet.title }}</q-item-label>
              <q-item-label caption lines="1">{{ wallet.caption }}</q-item-label>
            </q-item-section>
          </q-item> -->

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

    <q-tabs
      v-model="balanceTab"
      inline-label
      active-color="white"
      indicator-color="grey-13"
      active-bg-color="light-blue-10"
      class="bg-light-blue-9 text-white"
    >
      <q-tab no-caps name="balance" icon="toll" :label="$t('Coins')" />
      <q-tab no-caps name="delegations" icon="work" :label="$t('Delegations')" />
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

            <q-item-section side>{{ prettyNumber(amount, 4) }}</q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="delegations" class="q-pl-none q-pr-none">
        <div class="delegations" v-if="delegations && delegations.length">
          <q-list v-for="(item, name) in delegationsGroup" :key="name">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="item[0].validator_meta.icon_url">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold" lines="1">{{ item[0].validator_meta.name }}</q-item-label>
                <q-item-label caption lines="1">{{ item[0].validator_meta.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn size="1rem" flat color="light-blue-14" dense round icon="add_circle_outline" @click="$router.push({ name: 'send', params: { import: { address: item[0].pub_key } } })" />
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item dense v-for="coin in item" :key="coin.coin">
              <q-item-section>
                <q-item-label class="text-bold text-grey-7" lines="1">{{ coin.coin }}</q-item-label>
              </q-item-section>
              <q-item-section side>{{ prettyNumber(coin.value, 5) }}</q-item-section>
            </q-item>
            <q-separator color="grey-2" style="height: 1rem;" class="q-mt-xs" />
          </q-list>
        </div>
        <q-item-label v-else header>{{ $t('No delegations') }}</q-item-label>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { stringToHSL, prettyNumber } from '../utils'
import { copyToClipboard } from 'quasar'
import QRCode from 'qrcode'
// import WalletSelect from '../components/WalletSelect.vue'

export default {
  name: 'Wallet',
  // components: {
  //   WalletSelect
  // },
  data () {
    return {
      wallet: null,
      currentWallet: null,
      currentProfile: null,
      editWalletDialog: false,
      newTitle: false,
      qrAddressDialog: false,
      qrImg: '',
      settingWalletDialog: false,
      showSeedDialog: false,
      logoutDialog: false,
      balanceTab: 'balance'
    }
  },
  created () {
    const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
    this.wallet = this.walletsSelect[currentWallet]
    this.newTitle = this.wallet.title
    this.createQR()
  },
  methods: {
    prettyNumber: (val, l) => prettyNumber(val, l),
    stringToHSL: str => stringToHSL(str),
    shareTest () {
      if (navigator.share) return true
      else return false
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
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      balance: state => state.api.balance,
      delegations: state => state.api.delegations,
      delegationsTotal: state => state.api.delegationsTotal
    }),
    ...mapGetters([
      'balanceObj',
      'delegationsGroup',
      'coinsInfo',
      'delegationsSum',
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
