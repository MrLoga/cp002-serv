<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <q-page class="flex flex-center">

        <q-stepper v-model="step" ref="stepper" alternative-labels color="primary" animated style="width: 100%;">
          <q-step :name="1" title="About" icon="settings" :done="step > 1" style="height: 250px;">
            <p>Готово уже сейчас:</p>
            <ul style="padding: 0 14px;">
              <li>Авторизация в сервисах без сид фразы</li>
              <li>Мультиплатформенность. Можно как сайт, приложение на телефоне или компьютере</li>
              <li>Базовая отправка и делегирование монет</li>
              <li>Подсказка сообщающая кому вы отправляете или делегируете свои средства</li>
              <li>Баланс монет</li>
              <li>Средства в делегировании</li>
            </ul>
          </q-step>
          <q-step :name="2" title="Secure" icon="settings" :done="step > 2" style="height: 250px;">
            <p>Безопасность кошелька находиться на уровне официального веб кошелька от команды минтер.</p>
            <p>Защита ваших данных будет повышаться с последующими обновлениями, это один из основных векторов разработки.</p>
          </q-step>
          <q-step :name="3" title="Login" icon="settings" :done="step > 3" style="height: 250px; text-align: center;">
            <br>
            <q-btn color="secondary" @click="generateWallet">Create new wallet</q-btn>
            <br>
            <br>
            <p><b>Or</b></p>
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
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <div class="fit row reverse wrap justify-between items-end content-end">
                <q-btn @click="$refs.stepper.next()" v-if="step < 3" color="primary" :label="'Continue'" />
                <q-btn type="submit" :disabled="!validateMnemonic(mnemonic)" form="mnemonicLogin" v-if="step === 3" color="primary" label="Login" />

                <q-btn @click="$refs.stepper.previous()" v-if="step > 1" flat color="primary" label="Back" />
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
      step: 1,
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
      this.wallet = walletFromMnemonic(this.mnemonic)
      this.walletLogin()
      this.$router.push({ path: '/' })
    },
    generateWallet () {
      this.wallet = generateWallet()
      this.walletLogin()
      this.$router.push({ path: '/setting/private' })
    },
    walletLogin: function () {
      const walletData = {
        address: this.wallet.getAddressString(),
        publicKey: this.wallet.getPublicKeyString(),
        privateKey: this.wallet.getPrivateKeyString(),
        mnemonic: this.wallet.getMnemonic()
      }
      this.$store.commit('SAVE_WALLET', walletData)
      // this.$store.dispatch('SET_GATE').then((data) => {
      // })
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_COINS')
      this.$store.dispatch('FETCH_VALIDATORS')
      this.$store.dispatch('FETCH_DELEGATION')
      // this.$store.dispatch('NEW_WS')
    }
  }
}
</script>
