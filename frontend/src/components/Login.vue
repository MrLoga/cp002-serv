<template>
  <q-card class='login'>
    <q-card-section class='bg-secondary text-white'>
      <span class="text-subtitle2">Login</span><br>
      <span class='text-h6'>{{ item.requests[0] }}</span>
    </q-card-section>

    <q-card-section class='bg-secondary text-white'>
      <br>Request available {{ timerSeconds }} sec
    </q-card-section>

    <q-separator inset />

    <q-card-actions align='around'>
      <q-btn @click="reject" flat color="red">Cancel</q-btn>
      <q-btn @click="block" flat color="deep-orange">Block</q-btn>
      <q-btn @click="resolve" full-width flat color="primary">Apply</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>

import { mapState } from 'vuex'
import { getNewNonce } from '../utils/nacl'

export default {
  name: 'Login',
  props: ['item', 'index'],
  data () {
    return {
      timerSeconds: 0,
      loaded: false,
      intervalID: null
    }
  },
  methods: {
    countdown () {
      const now = new Date()
      const created = new Date(this.item.created)
      const dif = now.getTime() - created.getTime()
      const duration = Math.abs(60 - dif / 1000)
      this.timerSeconds = parseInt(duration % 60, 10)
      let timer = duration, seconds
      this.intervalID = setInterval(() => {
        seconds = parseInt(timer % 60, 10)
        seconds = seconds < 10 ? '0' + seconds : seconds
        this.timerSeconds = seconds

        if (--timer < 0) {
          clearInterval(this.intervalID)
          this.$q.notify({
            message: 'Request timeout',
            icon: 'access_time'
          })
          this.$store.commit('REMOVE_REQUEST', this.item.id)
        }
      }, 1000)
    },
    delay (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
      })
    },
    reject () {
      // notify(this.$f7, 'Вы отменили запрос', this.item.requesting);
      clearInterval(this.intervalID)
      const response = {
        id: this.nonce,
        from: 'wallet',
        to: this.item.id,
        action: 'login',
        response: ['reject']
      }
      this.$q.notify({
        message: 'Access to requests is canceled',
        icon: 'close'
      })
      this.$store.dispatch('RESPONSE', response)
    },
    block () {
      this.$q.notify({
        message: 'Domen blocked',
        icon: 'block'
      })
      clearInterval(this.intervalID)
      this.$store.dispatch('RESPONSE', {
        _id: this.nonce,
        from: 'wallet',
        to: this.item.id,
        action: 'login',
        response: ['blocked']
      })
    },
    resolve () {
      const domenNonce = getNewNonce()
      clearInterval(this.intervalID)
      this.$store.commit('SAVE_AUTH', {
        domen: this.item.requests[0],
        nonce: domenNonce
      })
      this.$q.notify({
        message: 'Access to requests is allow',
        color: 'teal',
        icon: 'done'
      })
      this.$store.dispatch('RESPONSE', {
        _id: this.nonce,
        from: 'wallet',
        to: this.item.id,
        action: 'login',
        response: [domenNonce]
      })
    }
  },

  computed: {
    ...mapState({
      nonce: state => state.wallet.nonce,
      address: state => state.wallet.address,
      private: state => state.wallet.private,
      minterGate: state => state.wallet.minterGate,
      wsPayment: state => state.payments.wsPayment
    })
  },
  created () {
    this.countdown()
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
  .login {
    width: 100%
  }
</style>
