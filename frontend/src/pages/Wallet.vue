<template>
  <q-page padding>
    <!-- <div class="text-grey-7 q-mt-lg">{{ $t('Current wallet') }}</div> -->
    <q-card v-if="wallet" flat bordered class="q-mb-lg q-mt-sm">
      <q-card-section>
        <div v-if="wallets.length === 1" style="font-size: 1.2rem">
          <b>{{ wallet.title }}</b>
          <span class="text-grey-7"> ({{ wallet.address.substr(0,4) + "..." + wallet.address.substr(-4) }})</span>
        </div>
        <q-select
          v-else
          v-model="wallet"
          outlined
          class="q-mb-xs"
          :label="$t('Сhoose active wallet')"
          bg-color="white"
          behavior="dialog"
          :options="walletsSelect"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section top avatar class="q-ml-none">
                <q-avatar text-color="primary">
                  <q-img v-if="scope.opt.icon" :src="scope.opt.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                    <template v-slot:error>
                      <div class="avatar__text text-white bg-primary">{{ scope.opt.title[0] }}</div>
                    </template>
                  </q-img>
                  <q-icon v-else name="person" color="grey" size="2rem" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1" v-html="scope.opt.label"></q-item-label>
                <q-item-label caption lines="1">{{ scope.opt.caption }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator inset />
          </template>
        </q-select>
        <div v-if="balance && balance.total_balance_sum" class="q-mt-sm">
          <div>{{ $t('Total balance') }}</div>
          <b>{{ prettyNumber(balance.total_balance_sum, 3) }} BIP</b>
          <span class="text-grey-7" v-if="balance && balance.total_balance_sum_usd">
            (~ {{ prettyNumber(balance.total_balance_sum_usd, 2) }} usd)
          </span>
        </div>
      </q-card-section>

      <q-list bordered>
        <q-item v-ripple clickable @click="copyAddress">
          <q-item-section avatar>
            <q-icon color="blue" name="file_copy" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ $t('Copy address') }}</q-item-label>
            <!-- <q-item-label caption>Copy to clipboard</q-item-label> -->
          </q-item-section>
        </q-item>
        <q-separator inset />

        <q-item v-ripple clickable @click="settingWalletDialog = true">
          <q-item-section avatar>
            <q-icon color="blue-grey-14" size="1.7rem" name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">{{ $t('Wallet setting') }}</q-item-label>
            <!-- <q-item-label caption>{{ $t('Open ') }}</q-item-label> -->
          </q-item-section>
        </q-item>
        <q-dialog v-model="settingWalletDialog" transition-show="scale" transition-hide="scale">
          <q-card class="dialog-min300">
            <q-list>
              <q-item v-if="wallet && wallet.title">
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
              </q-item>

              <q-item-label header class="q-pb-sm">{{ $t('Settings') }}</q-item-label>
              <q-separator />
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
        <q-dialog v-model="showSeedDialog" transition-show="scale" transition-hide="scale">
          <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
            <div class="text-subtitle1">{{ wallet.mnemonic }}</div>
            <q-separator class="q-mt-md q-mb-xs" />
            <q-card-actions>
              <q-btn flat dense :label="$t('Copy')" color="primary" @click="copyMnemonic" />
              <q-space />
              <q-btn flat dense :label="$t('Close')" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="logoutDialog" transition-show="scale" transition-hide="scale">
          <q-card class="dialog-min300 q-pa-md" style="padding-bottom: 4px;">
            <div class="text-h6 text-center">{{ $t('Attention') }}</div>
            <div class="text-subtitle2 text-center">{{ $t('Remove wallet text') }}</div>
            <q-separator class="q-mt-md q-mb-xs" />
            <q-card-actions>
              <q-btn flat dense :label="$t('Remove wallet')" color="red-10" @click="removeWallet" />
              <q-space />
              <q-btn flat dense :label="$t('Close')" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-list>
    </q-card>

    <q-tabs
      v-model="balanceTab"
      inline-label
      active-color="white"
      indicator-color="white"
      class="bg-teal text-white shadow-2"
    >
      <q-tab name="balance" icon="toll" :label="$t('Balance')" />
      <q-tab name="delegations" icon="work" :label="$t('Delegations')" />
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

            <q-item-section side>{{ prettyNumber(amount, 5) }}</q-item-section>
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

export default {
  name: 'Wallet',
  data () {
    return {
      wallet: null,
      currentWallet: null,
      currentProfile: null,
      settingWalletDialog: false,
      showSeedDialog: false,
      logoutDialog: false,
      balanceTab: 'balance'
    }
  },
  created () {
    const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
    this.wallet = this.walletsSelect[currentWallet]
  },
  methods: {
    prettyNumber: (val, l) => prettyNumber(val, l),
    stringToHSL: str => stringToHSL(str),
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
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      activeWallet: state => state.wallet.active,
      balance: state => state.api.balance,
      delegations: state => state.api.delegations
    }),
    ...mapGetters([
      'balanceObj',
      'delegationsGroup',
      'coinsInfo',
      'walletsSelect',
      'findWallet',
      'findUser'
    ])
  },
  watch: {
    wallet (val) {
      if (val && val.address) {
        this.wallet = val
        this.$store.commit('SET_WALLET', val.address)
        this.$store.dispatch('FETCH_BALANCE')
        this.$store.dispatch('FETCH_DELEGATION')
      }
    }
  }
}
</script>
