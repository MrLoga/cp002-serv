<template>
  <q-page padding class="flex justify-between text-center">
    <div class="full-width">
      <div class="text-h3 q-pa-lg text-weight-thin">This is your secret password</div>
      <div class="text-h3 text-weight-thin">Save it</div>
    </div>
    <div v-if="mnemonic" class="q-pa-lg full-width">
      <q-input
        v-model="mnemonic"
        outlined
        type="textarea"
        autogrow
        readonly
        class="bg-white start__mnemonic q-mb-sm"
      />
      <q-btn outline color="light-blue-14" label="Copy" />
    </div>
    <div class="full-width q-pa-lg">
      <q-btn rounded :disabled="btnDisabled" class="bg-light-blue-14 text-white full-width q-mt-lg" size="1.2em" @click="walletLogin" :label="btnLabel" />
      <q-btn rounded :disabled="btnDisabled" class="bg-white full-width q-mt-lg" size="1.2em" icon="keyboard_backspace" to="/start" :label="$t('Back')" />
    </div>
  </q-page>
</template>

<script>
import { generateMnemonic, walletFromMnemonic } from 'minterjs-wallet'

export default {
  name: 'Login',
  data () {
    return {
      loadingWallet: false,
      btnLabel: this.$t('I\'ve saved the password'),
      mnemonic: null,
      btnDisabled: false
    }
  },
  created () {
    setTimeout(() => {
      this.mnemonic = generateMnemonic()
    }, 10)
  },
  methods: {
    walletLogin () {
      this.btnDisabled = true
      this.btnLabel = 'Waiting ...'
      setTimeout(() => {
        const wallet = walletFromMnemonic(this.mnemonic)
        this.saveWallet(wallet)
      }, 100)
    },
    async saveWallet (wallet) {
      this.btnLabel = 'Ok'
      const walletData = {
        address: wallet.getAddressString(),
        privateKey: wallet.getPrivateKeyString(),
        mnemonic: wallet.getMnemonic(),
        title: 'Main wallet',
        icon: ''
      }
      console.log('SAVE_WALLET', walletData)
      this.$store.commit('SAVE_WALLET', walletData)
      await this.$store.dispatch('GET_CURRENCY')
      await this.$store.dispatch('FETCH_BALANCE')
      await this.$store.dispatch('FETCH_COINS')
      await this.$store.dispatch('FETCH_DELEGATION')
      this.$router.push({ path: '/' })
    }
  }
}
</script>
