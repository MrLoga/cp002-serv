<template>
  <div>
    <!-- <q-btn color="light-blue-14" text-color="white" class="full-width q-mt-sm" :label="$t('Add wallet')" icon="add_box" @click="newWalletDialog = true" /> -->
    <q-btn push stack class="bg-light-blue-14 text-white full-width q-pt-xs q-pl-none q-pr-none q-pb-xs" @click="newWalletDialog = true">
      <q-icon name="add_box" size="1.4rem" class="text-white" />
      <div style="font-size: 0.6rem" class="text-width-medium">{{ $t('Add wallet') }}</div>
      <!-- Добавить кошелек -->
    </q-btn>
    <q-dialog v-model="newWalletDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <form @submit.prevent.stop="saveNewWallet" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
          <q-card-section class="q-gutter-md">
            <div class="text-h6">{{ $t('Add wallet') }}</div>
            <q-input
              v-model="newTitle"
              outlined
              clearable
              spellcheck="false"
              :label="$t('Title')"
              :hint="$t('Optional')"
            ></q-input>
            <q-input
              v-model="newMnemonic"
              outlined
              clearable
              spellcheck="false"
              autogrow
              :label="$t('Mnemonic')"
              :error="newMnemonicIsError"
              :error-message="newMnemonicErrorMsg"
            >
              <template v-slot:after>
                <q-btn flat stack round no-caps icon="cached"
                  :style="generateWalletLoading ? 'cursor-pointer: none;' : ''"
                  :disabled="generateWalletLoading"
                  :loading="generateWalletLoading"
                  @click="generateWallet"
                >
                  <template v-slot:loading>
                    <q-spinner-gears />
                  </template>
                </q-btn>
              </template>
            </q-input>
            <div>
              <q-btn type="submit" class="full-width" :label="$t('Add wallet')" color="primary" :disabled="!newMnemonic || !newMnemonic.length" />
            </div>
          </q-card-section>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { isValidMnemonic, walletFromMnemonic, generateWallet } from 'minterjs-wallet'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'AddWallet',
  data () {
    return {
      newWalletDialog: false,
      newTitle: null,
      newMnemonic: null,
      newMnemonicIsError: null,
      newMnemonicErrorMsg: null,
      generateWalletLoading: false
    }
  },
  methods: {
    generateWallet () {
      this.generateWalletLoading = true
      setTimeout(() => {
        this.newMnemonic = generateWallet()._mnemonic
      }, 200)
    },
    saveNewWallet () {
      if (isValidMnemonic(this.newMnemonic)) {
        const tmpWallet = walletFromMnemonic(this.newMnemonic)
        const walletData = {
          address: tmpWallet.getAddressString(),
          privateKey: tmpWallet.getPrivateKeyString(),
          mnemonic: tmpWallet.getMnemonic()
        }
        const checkWallet = this.findWallet(walletData.address)
        if (checkWallet && checkWallet.address) {
          this.newMnemonicIsError = true
          this.newMnemonicErrorMsg = this.$t('This wallet already exists')
        } else {
          const profile = this.findProfile(walletData.address)
          walletData.title = this.newTitle || (profile ? profile.title : '') || (this.walletsSelect.length ? (this.walletsSelect.length + 1) + ' wallet' : 'Main wallet')
          walletData.icon = profile ? profile.icon : ''

          this.newWalletDialog = false
          this.$store.commit('SAVE_WALLET', walletData)
          this.$store.dispatch('FETCH_BALANCE')
          this.$store.dispatch('FETCH_DELEGATION')
          this.$router.push({ path: '/wallet' })
        }
      } else {
        this.newMnemonicIsError = true
        this.newMnemonicErrorMsg = 'Invalid mnemonic'
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address
    }),
    ...mapGetters([
      'walletsSelect',
      'findWallet',
      'findProfile'
    ])
  },
  watch: {
    newWalletDialog () {
      this.newMnemonic = null
      this.newTitle = null
    },
    newMnemonic (val) {
      setTimeout(() => {
        this.newMnemonicIsError = false
        this.generateWalletLoading = false
      }, 200)
    }
  }
}
</script>
