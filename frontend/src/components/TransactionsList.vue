<template>
  <div>
    <q-checkbox v-model="showMultisend" label="Show Multisend" class="q-mt-sm q-ml-sm" />
    <div v-if="transactions">
      <q-list class="transactions" separator v-for="(transactionList, index) in transactions" :key="index">
        <div class="text-grey text-h6 q-mb-xs q-pl-md q-mt-md" v-if="checkOnlyMultisend(transactionList) || showMultisend">{{ index}}</div>
        <q-item v-for="item in transactionList" :key="item.txn" v-show="showMultisend || item.type !== 'MULTISEND'" class="bg-white" clickable v-ripple @click="openDialog(item)">
          <q-item-section avatar>
            <q-icon v-if="item.type === 'SEND'" name="send" color="light-blue-4" size="xs" />
            <q-icon v-else-if="item.type === 'DELEGATE' || item.type === 'UNBOND'" name="work" color="light-blue-4" size="xs" />
            <q-icon v-else-if="item.type === 'BUY' || item.type === 'SELL' || item.type === 'SELL_ALL'" name="cached" color="light-blue-4" size="xs" />
            <q-icon v-else-if="item.type === 'MULTISEND'" name="playlist_play" color="light-blue-4" size="sm" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-mb-xs text-weight-medium" lines="1" v-html="item.title" />
            <q-item-label class="text-grey" caption lines="1">{{ item.date }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label :class="`${ item.symbol === '+' ? 'text-green' : item.symbol === '-' ? 'text-red' : 'text-grey-8' } text-weight-medium q-mb-xs`">{{ item.symbol }} {{ item.value }} {{ item.coin }}</q-item-label>
            <q-item-label caption>{{ item.desc }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else class="text-center q-mt-lg">
      <q-spinner size="7em" :thickness="2" color="purple-2" />
    </div>

    <q-dialog v-model="txDialog" transition-show="scale" transition-hide="scale">
      <q-card v-if="txDataDialog" class="dialog-min300 q-pa-md">
        <!-- {{ txDataDialog.title }} -->
        <div class="text-h5 text-center q-mb-sm">{{ txDataDialog.desc }}</div>
        <div class="text-subtitle row">
          <span v-if="txDataDialog.type === 'BUY' || txDataDialog.type === 'SELL' || txDataDialog.type === 'SELL_ALL'" class="col-2 text-grey-7">Sell: </span>
          <span v-if="txDataDialog.type === 'SEND' && txDataDialog.symbol === '-'" class="col-2 text-grey-7">To:</span>
          <span v-if="txDataDialog.symbol === '' || (txDataDialog.type === 'SEND' && txDataDialog.symbol === '+')" class="col-2 text-grey-7">From:</span>
          <span class="col" v-html="txDataDialog.title"></span>
        </div>
        <div class="row">
          <span v-if="txDataDialog.type === 'BUY' || txDataDialog.type === 'SELL' || txDataDialog.type === 'SELL_ALL'" class="col-2 text-grey-7">Buy: </span>
          <span v-else class="col-2 text-grey-7">Value: </span>
          <span :class="`${ txDataDialog.symbol === '+' ? 'text-green' : txDataDialog.symbol === '-' ? 'text-red' : 'text-grey-8' } col text-weight-medium`">{{ txDataDialog.symbol }} {{ txDataDialog.value }} {{ txDataDialog.coin }}</span>
        </div>
        <div class="row">
          <span class="col-2 text-grey-7">Date: </span>
          <span class="col">{{ txDataDialog.date }}</span>
        </div>
        <div v-if="txDataDialog.message" class="q-mt-md">
          {{ txDataDialog.message }}
        </div>
        <div v-if="txDataDialog.type === 'SEND' && txDataDialog.symbol === '-'" class="row q-mt-md">
          <div class="col-6 q-pr-xs">
            <q-btn @click="$router.push({ name: 'send', params: { import: { address: txDataDialog.to, coin: txDataDialog.coin, amount: txDataDialog.value } } })" stack label="Repeat" icon="repeat" class="bg-light-blue-14 text-white full-width" />
          </div>
          <div class="col-6 q-pl-xs">
            <q-btn @click="openURL('https://minterscan.net/tx/' + txDataDialog.hash)" stack label="Open explorer" icon="open_in_new" class="bg-light-blue-14 text-white full-width" />
          </div>
        </div>
        <div v-else class="q-mt-lg">
          <q-btn @click="openURL('https://minterscan.net/tx/' + txDataDialog.hash)" label="Open explorer" icon="open_in_new" class="bg-light-blue-14 text-white full-width" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import { getFeeValue } from 'minterjs-util'
import { date, openURL } from 'quasar'
import { TX_TYPE } from 'minter-js-sdk'
import { mapState, mapGetters } from 'vuex'
import { prettyNumber, shortAddress } from '../utils'
import Big from 'big.js'

export default {
  name: 'Transactions',
  props: {
    address: String
  },
  data () {
    return {
      showMultisend: false,
      txDialog: false,
      txDataDialog: null,
      transactions: null,
      txTypeId: {},
      txTypeDesc: {
        'BUY': 'Buy',
        'CREATE_COIN': 'Create coin',
        'CREATE_MULTISIG': 'Create multisig',
        'DECLARE_CANDIDACY': 'Declare candidacy',
        'DELEGATE': 'Delegate',
        'EDIT_CANDIDATE': 'Edit candidate',
        'MULTISEND': 'Multisend',
        'REDEEM_CHECK': 'Redeem check',
        'SELL': 'Sell',
        'SELL_ALL': 'Sell all',
        'SEND': 'Send',
        'SET_CANDIDATE_OFF': 'Set candidate off',
        'SET_CANDIDATE_ON': 'Set candidate on',
        'UNBOND': 'Unbond'
      }
    }
  },
  created () {
    for (const tx in TX_TYPE) {
      this.txTypeId[parseInt(TX_TYPE[tx])] = tx
    }
    this.loadTransactions()
  },
  methods: {
    // prettyNumber: (val, l) => prettyNumber(val, l),
    openURL: val => openURL(val),
    openDialog (item) {
      this.txDialog = true
      this.txDataDialog = item
    },
    b64DecodeUnicode (str) {
      return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    },
    checkOnlyMultisend (list) {
      return list.reduce((prev, curr) => curr.type !== 'MULTISEND' ? prev + 1 : prev, 0)
    },
    async loadTransactions () {
      const data = await this.$store.dispatch('FETCH_TRANSACTION', this.address)
      const updateData = data.data.map(item => {
        const tmpObj = {
          to: item.data.to,
          hash: item.hash,
          type: this.txTypeId[item.type],
          date: date.formatDate(item.timestamp, 'DD.MM.YYYY HH:mm'),
          timestamp: item.timestamp,
          message: this.b64DecodeUnicode(item.payload)
        }
        tmpObj.desc = this.txTypeDesc[tmpObj.type]
        if (tmpObj.type === 'SEND') {
          if (item.from === this.address) {
            tmpObj.symbol = '-'
            const user = this.findUser(item.data.to)
            tmpObj.title = user ? user.title : shortAddress(item.data.to)
          } else {
            tmpObj.symbol = '+'
            const user = this.findUser(item.from)
            tmpObj.title = user ? user.title : shortAddress(item.from)
          }
          tmpObj.value = prettyNumber(item.data.value, 1)
          tmpObj.coin = item.data.coin
          tmpObj.to = item.data.to
        } else if (tmpObj.type === 'DELEGATE') {
          tmpObj.symbol = '='
          const validator = this.findValidator(item.data.pub_key)
          tmpObj.title = validator ? validator.meta.name : shortAddress(item.data.pub_key)
          tmpObj.value = prettyNumber(item.data.value, 1)
          tmpObj.coin = item.data.coin
        } else if (tmpObj.type === 'BUY' || tmpObj.type === 'SELL' || tmpObj.type === 'SELL_ALL') {
          tmpObj.symbol = '+'
          tmpObj.title = `<span class='text-red'>- ${ prettyNumber(item.data.value_to_sell) } ${ item.data.coin_to_sell }</span>`
          tmpObj.value = prettyNumber(item.data.value_to_buy, 1)
          tmpObj.coin = item.data.coin_to_buy
        } else if (tmpObj.type === 'MULTISEND') {
          if (item.from === this.address) {
            tmpObj.symbol = '-'
            tmpObj.title = 'Multisend to ' + item.data.list.length + ' address'
            // const sendData = item.data.list.find(msend => msend.to === this.address)
            const tmpSumList = item.data.list.reduce((prev, curr) => Big(prev).plus(curr.value), Big(0))
            tmpObj.value = Big(tmpSumList).round(2, 3).toString()
            tmpObj.coin = item.data.list[0].coin
          } else {
            tmpObj.symbol = '+'
            const user = this.findUser(item.from)
            tmpObj.title = '<span class="text-grey-7">From:</span>  ' + (user ? user.title : shortAddress(item.from))
            const sendData = item.data.list.find(msend => msend.to === this.address)
            tmpObj.value = prettyNumber(sendData.value, 1)
            tmpObj.coin = sendData.coin
          }
        } else if (tmpObj.type === 'UNBOND') {
          tmpObj.symbol = ''
          const validator = this.findValidator(item.data.pub_key)
          tmpObj.title = validator ? validator.meta.name : shortAddress(item.data.pub_key)
          tmpObj.value = prettyNumber(item.data.value, 1)
          tmpObj.coin = item.data.coin
        }
        return tmpObj
      })

      this.transactions = updateData.reduce((prev, curr) => {
        (prev[date.formatDate(curr.timestamp, 'DD.MM')] = prev[date.formatDate(curr.timestamp, 'DD.MM')] || []).push(curr)
        // console.log(prev, curr)
        return prev
      }, {})
    }
  },
  computed: {
    ...mapState({
      // address: state => state.wallet.address
    }),
    ...mapGetters([
      'findUser',
      'findValidator'
    ])
  },
  watch: {
    address (val) {
      this.transactions = null
      this.loadTransactions()
    }
  }
}
</script>
