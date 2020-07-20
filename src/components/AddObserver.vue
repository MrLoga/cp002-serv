<template>
  <div>
    <!-- <q-btn color="light-blue-14" text-color="white" class="full-width q-mt-sm" :label="$t('Add wallet')" icon="add_box" @click="newWalletDialog = true" /> -->
    <q-btn push stack class="bg-light-blue-14 text-white full-width q-pa-xs q-pl-none q-pr-none" @click="newWalletDialog = true">
      <q-icon name="visibility" size="1.4rem" class="text-white" />
      <div style="font-size: 0.6rem; white-space: nowrap;" class="text-width-medium">{{ $t('Add observer') }}</div>
      <!-- Добавить кошелек -->
    </q-btn>
    <q-dialog v-model="newWalletDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <form @submit.prevent.stop="saveNewObserver" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
          <q-card-section class="q-gutter-md">
            <div class="text-h6">{{ $t('Add observer') }}</div>
            <q-input
              v-model="newTitle"
              outlined
              clearable
              spellcheck="false"
              :label="$t('Title')"
              :hint="$t('Optional')"
            ></q-input>
            <q-input
              v-model="newAddress"
              outlined
              clearable
              spellcheck="false"
              autogrow
              :label="$t('Address')"
              :error="newAddressIsError"
              :error-message="newAddressErrorMsg"
            ></q-input>
            <div>
              <q-btn type="submit" class="full-width" :label="$t('Add wallet')" color="primary" :disabled="!newAddress || !newAddress.length" />
            </div>
          </q-card-section>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { checkAddress } from '../utils'
export default {
  name: 'AddObserver',
  data () {
    return {
      newWalletDialog: false,
      newTitle: null,
      newAddress: null,
      newAddressIsError: null,
      newAddressErrorMsg: null
    }
  },
  methods: {
    saveNewObserver () {
      if (checkAddress(this.newAddress) === 'Mx') {
        const tmpObserver = {
          address: this.newAddress,
          icon: null,
          title: 'Observer'
        }
        const checkWallet = this.findWallet(tmpObserver.address)
        const checkObserve = this.findObserver(tmpObserver.address)
        if ((checkWallet && checkWallet.address) || (checkObserve && checkObserve.address)) {
          this.newAddressIsError = true
          this.newAddressErrorMsg = this.$t('This wallet already exists')
        } else {
          const profile = this.findProfile(tmpObserver.address)
          tmpObserver.title = this.newTitle || (profile ? profile.title : '') || (this.observerSelect.length ? (this.observerSelect.length + 1) + ' observer' : 'Observer')
          tmpObserver.icon = profile ? profile.icon : ''

          this.newWalletDialog = false
          this.$store.commit('SAVE_OBSERVER', tmpObserver)
          this.$router.push({ path: '/wallet/' + tmpObserver.address })
        }
      } else {
        this.newAddressIsError = true
        this.newAddressErrorMsg = 'Invalid adress'
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address
    }),
    ...mapGetters([
      'walletsSelect',
      'observerSelect',
      'findWallet',
      'findObserver',
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
