<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <q-page class="flex flex-center">

        <q-stepper v-model="step" ref="stepper" alternative-labels color="primary" animated style="width: 100%;">
          <q-step :name="2" title="About" icon="settings" :done="step > 2" style="height: 250px;">
            <div class="text-h5 text-center">WALLET.REEF.MN</div>
            <div class="text-center q-mt-md">
              <q-img src="statics/app-logo-128x128.png" height="128px" width="128px" />
            </div>
          </q-step>
          <q-step :name="3" title="Login" icon="settings" :done="step > 3" style="height: 250px; text-align: center;">
            <div v-if="!loadingWallet">
              <q-btn color="secondary" class="q-mt-md" @click="generateWallet">Create new wallet</q-btn>
              <div class="text-bold q-mt-md q-mb-md">Or</div>
              <form @submit.prevent.stop="signIn" id="mnemonicLogin">
                <q-input
                  v-model="mnemonic"
                  outlined
                  autogrow
                  label="Login by Seed phrase"
                  :rules="[val => !!val || 'Field is required',
                          val => validateMnemonic(val) || 'Invalid seed phrase']"
                />
              </form>
            </div>
            <div v-else class="text-center q-mt-lg">
              <q-spinner-oval
                color="primary"
                size="8rem"
              />
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <div class="fit row reverse wrap justify-between items-end content-end">
                <q-btn @click="$refs.stepper.next()" v-if="step < 3" color="primary" :label="'Continue'" />
                <q-btn type="submit" :disabled="!validateMnemonic(mnemonic)" form="mnemonicLogin" v-if="step === 3" color="primary" label="Login" />

                <q-btn @click="$refs.stepper.previous()" v-if="step > 2" flat color="primary" label="Back" />
              </div>
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-page>

    </q-page-container>

  </q-layout>
</template>

<script>
import { isValidMnemonic, walletFromMnemonic, generateWallet } from 'minterjs-wallet'

export default {
  name: 'Login',
  data () {
    return {
      step: 2,
      loadingWallet: false,
      wallet: null,
      mnemonic: ''
    }
  },
  methods: {
    signIn () {
      if (isValidMnemonic(this.mnemonic)) this.authSeed()
    },
    validateMnemonic: val => isValidMnemonic(val),
    authSeed () {
      this.loadingWallet = true
      setTimeout(() => {
        this.wallet = walletFromMnemonic(this.mnemonic)
        this.walletLogin()
      }, 100)
    },
    generateWallet () {
      this.loadingWallet = true
      setTimeout(() => {
        this.wallet = generateWallet()
        this.walletLogin()
      }, 100)
    },
    async walletLogin () {
      const walletData = {
        address: this.wallet.getAddressString(),
        privateKey: this.wallet.getPrivateKeyString(),
        mnemonic: this.wallet.getMnemonic()
      }

      try {
        const profile = await this.$store.dispatch('GET_PROFILE', walletData.address)
        walletData.title = (profile && profile.title) ? profile.title : 'Main wallet'
        walletData.icon = (profile && profile.icon) ? profile.icon : ''
      } catch {
        walletData.title = 'Main wallet'
        walletData.icon = ''
      }

      this.$store.commit('SAVE_WALLET', walletData)
      await this.$store.dispatch('FETCH_BALANCE')
      await this.$store.dispatch('FETCH_COINS')
      await this.$store.dispatch('FETCH_DELEGATION')
      this.$router.push({ path: '/' })
    }
  }
}
</script>
