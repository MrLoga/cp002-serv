<template>
  <q-page padding>
    <q-card v-if="!isRegistered">
      <q-card-section class="bg-purple text-white">
        <div class="text-h6">{{ $t('You are not registered in the Authenticator') }}</div>
        <div>{{ $t('Authenticator Registration text') }}</div>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn :disabled="balancesJSON['BIP'] <= signFee" @click="registerAddress" flat>{{ $t('Sign in') }}</q-btn>
      </q-card-actions>
    </q-card>

    <q-list v-else-if="requests && requests.length">
      <q-item-label header>Request</q-item-label>
      <q-item v-for="item in requests" :key='item.id'>
        <payment v-if="item.action === 'payment'" :item="item"></payment>
        <login v-if="item.action === 'login'" :item="item"></login>
      </q-item>
    </q-list>
    <q-item-label v-else header>{{ $t('No requests') }}</q-item-label>
  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import Payment from '../components/Payment'
import Login from '../components/Login'
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE } from 'minterjs-tx'

export default {
  name: 'Requests',
  components: {
    Payment,
    Login
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      requests: state => state.request.requests,
      login: state => state.request.login,
      balances: state => state.api.balances,
      balancesJSON: state => state.api.balancesJSON,
      wsStatus: state => state.request.wsStatus
    }),
    ...mapGetters([
      'isLogin',
      'isRegistered'
    ])
  },
  methods: {
    registerAddress () {
      this.$store.dispatch('REGISTER_ADDRESS')
    },
    clearAll () {
      this.$store.commit('CLEAR_ALL_REQUESTS')
    },
    signFee () {
      return getFeeValue(TX_TYPE.SEND, { payload: 'MX4qptIH0mXijR8XlroE56txuOeyig==' })
    }
  },
  created () {
  }
}
</script>
