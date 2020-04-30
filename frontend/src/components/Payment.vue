<template>
  <q-card class='payment'>
    <q-card-section class='bg-accent text-white'>
      From: <span class='text-subtitle2'>{{ item.url }}</span>
    </q-card-section>
    <q-separator />
    <q-card-section class='bg-accent text-white'>
      <div class='' v-html="humanFriendly(item.requests[0])"></div>
      <div>
        {{ timerSeconds }}
      </div>
    </q-card-section>

    <q-separator inset v-if="item.requests[0].message && item.requests[0].message.length" />
    <q-card-section v-if="item.requests[0].message && item.requests[0].message.length">
      <q-item-label caption>Message</q-item-label>
      <div class='text-subtitle2'>{{ item.requests[0].message }}</div>
    </q-card-section>

    <q-separator inset />
    <q-card-actions align='around'>
      <q-btn @click="reject" flat color="red">Cancel</q-btn>
      <q-btn @click="resolve" full-width flat color="primary">Apply</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>

import { mapState } from 'vuex'
import { pretty } from '../utils'

export default {
  name: 'Payment',
  props: ['item', 'index'],
  data () {
    return {
      timerSeconds: 0,
      loaded: false,
      intervalID: null
    }
  },
  methods: {
    humanFriendly (tx) {
      let text = ''
      switch (tx.txAction) {
        case 'SendTxParams':
          text += 'Send '
          text += '<b>' + pretty(tx.amount, 5)
          text += ' ' + tx.coinSymbol + '</b>'
          text += ' to the address <br><b>' + tx.address + '</b>'
          break
      }
      return text
    },
    countdown () {
      const now = new Date()
      const created = new Date(this.item.date)
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
    // countdown () {
    //   let now = new Date(this.item.date)
    //   let created = new Date(this.item.created)
    //   let dif = now.getTime() - created.getTime()
    //   let duration = Math.abs(60 - dif / 1000)
    //   let timer = duration, seconds
    //   this.intervalID = setInterval(() => {
    //     seconds = parseInt(timer % 60, 10)
    //     seconds = seconds < 10 ? '0' + seconds : seconds
    //     this.timerSeconds = seconds

    //     if (--timer < 0) {
    //       clearInterval(this.intervalID)
    //       this.$store.commit('CHANGE_STATUS', { index: this.index, type: 'payment', status: 'timeout' })
    //     }
    //   }, 1000)
    // },
    delay (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
      })
    },
    resolve () {
      const requestResult = []
      if (this.item.requests.length === 2) {
        // this.$f7.dialog.preloader()
      }

      this.$store.dispatch('SENDER', this.item.requests[0]).then((tx1Hash) => {
        requestResult.push(tx1Hash)
        if (this.item.requests.length === 1) {
          return new Promise(resolve => resolve())
        } else if (this.item.requests.length === 2) {
          return this.delay(6500).then(() => {
            return this.sendTransaction(this.item.requests[1])
          })
        }
      }).then((tx2Hash) => {
        if (this.item.requests.length === 2 && !!tx2Hash) {
          requestResult.push(tx2Hash)
        }
        if (this.item.requests.length === 2) {
          // this.$f7.dialog.close()
        }
        clearInterval(this.intervalID)
        const response = {
          id: this.nonce,
          from: 'wallet',
          to: this.item.id,
          action: 'payment',
          response: requestResult
        }
        this.$q.notify({
          message: 'Request resolved',
          color: 'teal',
          icon: 'done'
        })
        this.$store.dispatch('RESPONSE', response)
      }).catch((error) => {
        this.$q.notify({
          message: error,
          color: 'negative',
          icon: 'report_problem'
        })
      })
    },
    reject () {
      this.$q.notify({
        message: 'Request rejected',
        icon: 'close'
      })
      clearInterval(this.intervalID)
      const response = {
        id: this.nonce,
        from: 'wallet',
        to: this.item.id,
        action: 'payment',
        response: ['reject']
      }
      this.$store.dispatch('RESPONSE', response)
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
  .payment {
    width: 100%
  }
</style>
