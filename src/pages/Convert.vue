<template>
  <q-page>
    <q-tabs
      v-model="convertTab"
      inline-label
      active-color="white"
      indicator-color="grey-4"
      active-bg-color="light-blue-10"
      class="bg-light-blue-9 text-white"
    >
      <q-tab name="sell" :label="$t('Exchange')" />
      <q-tab name="buy" :label="$t('Get')" />
    </q-tabs>
    <q-tab-panels v-model="convertTab" animated class="bg-grey-1">
      <q-tab-panel name="sell">
        <form @submit.prevent.stop="confirmConvert = true" class="q-gutter-md">

          <BalanceSelect v-model="coin" />

          <q-input
            v-model="amount"
            type="number"
            step="any"
            outlined
            clearable
            spellcheck="false"
            debounce="250"
            bg-color="white"
            :label="$t('Amount')"
            :error="amountIsError"
            :error-message="amountErrorMsg"
          >
            <template v-slot:after>
              <q-btn round no-caps flat label="Max" @click="maxAmount" />
            </template>
          </q-input>

          <div class="text-center q-mt-none">
            <q-icon name="arrow_downward" color="text-grey-7" size="md" />
          </div>

          <CoinsSelect v-model="coinTo" />

          <div class="q-mt-md">
            <q-btn type="submit" color="teal" size="16px"  icon="compare_arrows" class="full-width" :disabled="!validate" :label="$t('Exchange')" />
          </div>

          <div v-if="user">
            <q-checkbox v-model="isAutoTransaction" color="teal" dense>
              {{ $t('Automatically repeat transaction') }}
              <span class="text-italic text-weight-light">
                {{ $t('(you can cancel this any time)') }}
              </span>
              <!-- {{ $t('Auto-delegate')}} -->
            </q-checkbox>
          </div>

          <div v-if="validate && txType === 'SELL' && resultSell != 0">
            <span class="text-subtitle1">{{ $t('You will get') }}</span>&nbsp;
            <span class="text-h6">{{ prettyNumber(resultSell, 3) }}</span>&nbsp;
            <span class="text-subtitle1">{{ coinTo.value.toUpperCase() }}</span>
          </div>
          <div class="text-negative" v-if="!validate">{{ validateError }}</div>
          <div class="text-grey-7 q-mt-none">
            {{ $t('Transaction fee') }}: {{ prettyNumber(commission, 5) }} {{ commissionCoin }}
          </div>
        </form>
      </q-tab-panel>

      <q-tab-panel name="buy">
        <form @submit.prevent.stop="confirmConvert = true" class="q-gutter-md">

          <CoinsSelect v-model="coinTo" />

          <q-input
            v-model="amount"
            type="number"
            step="any"
            outlined
            spellcheck="false"
            clearable
            debounce="250"
            bg-color="white"
            :label="$t('Amount')"
            :error="amountIsError"
            :error-message="amountErrorMsg"
          />

          <div class="text-center q-mt-none">
            <q-icon name="arrow_upward" color="text-grey-7" size="md" />
          </div>

          <BalanceSelect v-model="coin" />

          <div>
            <q-btn type="submit" color="teal" size="16px" icon="compare_arrows" class="full-width" :disabled="!validate" :label="$t('Exchange')" />
          </div>
          <div v-if="validate && txType === 'BUY' && resultBuy != 0">
            <span class="text-subtitle1">{{ $t('You will pay') }}</span>&nbsp;
            <span class="text-h6">{{ prettyNumber(resultBuy, 5) }}</span>&nbsp;
            <span class="text-subtitle1">{{ coin.value.toUpperCase() }}</span>
          </div>
          <div class="text-negative" v-if="!validate">{{ validateError }}</div>
          <div class="text-grey-7 q-mt-none">
            {{ $t('Transaction fee') }}: {{ prettyNumber(commission, 5) }} {{ commissionCoin }}
          </div>
        </form>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-if="validate" v-model="confirmConvert" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section class="text-center" v-if="txType === 'SELL'">
          <div class="text-h5 text-grey-7 q-mb-md">{{ $t('Youre Exchange') }}</div>
          <div class="text-h5">{{ prettyNumber(amountBig.toString(), 3) }} <span class="text-h6">{{ coin.value }}</span></div>
          <div class="text-grey-7">{{ $t('to') }}</div>
          <div class="text-h5">{{ prettyNumber(resultSell, 3) }} <span class="text-h6">{{ coinTo.value }}</span></div>
        </q-card-section>
        <q-card-section class="text-center" v-else>
          <div class="text-h5 text-grey-7 q-mb-md">{{ $t('Youre Exchange') }}</div>
          <div class="text-h5">{{ prettyNumber(resultBuy, 3) }} <span class="text-h6">{{ coin.value }}</span></div>
          <div class="text-grey-7">{{ $t('to') }}</div>
          <div class="text-h5">{{ prettyNumber(amount, 3) }} <span class="text-h6">{{ coinTo.value }}</span></div>
        </q-card-section>

        <q-separator inset />
        <q-card-actions align='around'>
          <q-btn flat :label="$t('Cancel')" color="red" v-close-popup />
          <q-btn flat :label="$t('Accept')" color="primary" @click="senderConvert" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { getFeeValue } from 'minterjs-util'
import { TX_TYPE } from 'minter-js-sdk'
import { mapGetters, mapState } from 'vuex'
import { prettyNumber } from '../utils'
import Big from 'big.js'
import BalanceSelect from '../components/BalanceSelect.vue'
import CoinsSelect from '../components/CoinsSelect.vue'

export default {
  name: 'Convert',
  components: {
    BalanceSelect,
    CoinsSelect
  },
  data () {
    return {
      convertTab: 'sell',
      txType: 'SELL',
      coin: null,
      coinTo: null,

      amount: null,
      amountBig: null,
      amountIsError: false,
      amountErrorMsg: null,

      validate: false,
      validateError: null,

      commission: getFeeValue(TX_TYPE.SELL),
      commissionCoin: 'BIP',

      confirmConvert: false,
      resultBuy: 0,
      resultSell: 0,
      isAutoTransaction: false,
    }
  },
  mounted () {
    this.setDefaultCoin()
  },
  methods: {
    prettyNumber: (val, l) => prettyNumber(val, l),
    setDefaultCoin () {
      if (Big(this.balanceSelect[0].amount).gt(0)) {
        this.coin = this.balanceSelect[0]
      } else {
        this.coin = this.balanceSelect[1] ? this.balanceSelect[1] : this.balanceSelect[0]
      }
    },
    maxAmount () {
      this.amount = this.coin ? Big(this.coin.amount).toString() : null
    },
    clearAll () {
      this.coin = null
      this.coinTo = null
      this.amount = null
      this.amountBig = null
      this.confirmConvert = false
      this.resultBuy = 0
      this.resultSell = 0
      this.validate = false
      this.txError = ''
      this.isAutoTransaction = false

      this.txType = this.convertTab.toUpperCase()
      this.setDefaultCoin()
    },
    makeTxData () {
      const txData = {
        type: this.txType,
        data: {
          coinToSell: this.coin.value,
          coinToBuy: this.coinTo.value
        },
        gasCoin: this.commissionCoin
      }
      if (this.txType === 'SELL') {
        if (this.amountBig.eq(this.coin.amount)) {
          txData.type = 'SELL_ALL'
        } else if (Big(this.coin.amount).lt(Big(this.amount).plus(this.commission))) {
          txData.type = 'SELL_ALL'
          // txData.type = 'SELL'
          // if (this.coin.value === this.commissionCoin) {
          //   txData.data.valueToSell = Big(this.coin.amount).minus(this.commission).toString()
          // } else {
          //   txData.data.valueToSell = this.amountBig.toString()
          // }
          // txData.data.valueToSell = this.amountBig.toString()
          // txData.data.valueToSell = this.amountBig.toString()
        } else {
          txData.data.valueToSell = this.amountBig.toString()
        }
      } else if (this.txType === 'BUY') {
        txData.data.valueToBuy = this.amountBig.toString()
      }
      return txData
    },
    async estimateTx () {
      const estimateTxAction = this.txType === 'BUY' ? 'estimateCoinBuy' : 'estimateCoinSell'
      const estimateTxData = {
        coinToSell: this.coin.value,
        coinToBuy: this.coinTo.value
      }
      if (estimateTxAction === 'estimateCoinBuy') {
        estimateTxData.valueToBuy = this.amountBig.toString()
      } else if (estimateTxAction === 'estimateCoinSell') {
        estimateTxData.valueToSell = this.amountBig.toString()
      }
      try {
        const result = await this.minterGate[estimateTxAction](estimateTxData)
        console.log(result)
        this.resultSell = result.will_get
        this.resultBuy = result.will_pay

        const bipFee = getFeeValue(TX_TYPE[this.txType])
        if (this.coin.value === 'BIP') {
          if (Big(this.coin.amount).lt(bipFee)) {
            this.validate = false
            this.amountIsError = true
            this.amountErrorMsg = this.$t('Not enough') + ` ${ Big(this.amountBig).minus(this.coin.amount).plus(result.commission).round(3, 0).toString() } ${this.coin.value }`
          }
          if (Big(this.coin.amount).lt(this.amountBig.plus(bipFee))) {
            this.amountBig = Big(this.coin.amount).minus(bipFee)
          }
          this.commission = bipFee
          this.commissionCoin = 'BIP'
        } else {
          if (Big(this.balanceObj.BIP).lt(bipFee)) {
            if (this.txType === 'SELL' && result.will_get) {
              if (Big(this.coin.amount).lt(this.amountBig.plus(result.commission))) {
                this.resultSell = result.will_get
                if (Big(this.coin.amount).gte(result.commission)) {
                  this.amountBig = Big(this.coin.amount).minus(result.commission)
                  this.resultSell = Big(result.will_get).minus(result.commission).toString()
                } else {
                  this.validate = false
                  this.amountIsError = true
                  this.amountErrorMsg = this.$t('Not enough') + ` ${ Big(this.amountBig).minus(this.coin.amount).plus(result.commission).round(3, 0).toString() } ${ this.coin.value } ` + this.$t('for transaction fee')
                }
                this.commissionCoin = this.coin.value
                this.commission = result.commission
              } else {
                this.commissionCoin = this.coin.value
                this.commission = result.commission
              }
            } else if (this.txType === 'BUY' && result.will_pay) {
              console.log(result)
              if (Big(result.commission).gt(result.will_pay)) {
                this.validate = false
                this.amountIsError = true
                this.amountErrorMsg = this.$t('Not enough') + ` ${ Big(result.commission).minus(result.will_pay).round(3, 0).toString() } ${this.coin.value } ` + this.$t('for transaction fee')
              } else {
                this.commissionCoin = this.coin.value
                this.commission = result.commission
              }
            }
          } else {
            this.commission = bipFee
            this.commissionCoin = 'BIP'
          }
        }
        // this.commissionCoin = this.coin.value
        // this.commission = result.commission

        console.log('estimate')
        console.log(result, bipFee)
        if (result.will_pay && Big(result.will_pay).gt(Big(this.coin.amount))) {
          this.validate = false
          this.amountIsError = true
          this.amountErrorMsg = this.$t('Not enough') + ` ${ Big(result.will_pay).minus(this.coin.amount).plus(result.commission).round(3, 0).toString() } ${this.coin.value }`
        }
      } catch (error) {
        console.log(error)
      }
    },
    valifateForm () {
      this.amountIsError = false
      this.amountErrorMsg = null
      this.validate = true
      this.validateError = null
      this.amountBig = this.amount ? Big(this.amount.replace(',', '.')) : Big(0)

      if (!this.coin || !this.coinTo) {
        this.validate = false
      } else if (this.coin && this.coinTo && this.coin.value === this.coinTo.value) {
        this.validate = false
        this.txError = this.$t('Сhoose different coins')
      }
      if (this.txType === 'SELL' && this.coin && Big(this.amountBig).gt(Big(this.coin.amount))) {
        this.validate = false
        this.amountIsError = true
        this.amountErrorMsg = this.$t('Not enough') + ` ${ Big(this.amountBig).minus(this.coin.amount).round(3, 0).toString() } ${this.coin.value }`
      }
      if (!this.amount || !this.amount.length || this.amountBig.lte(0)) this.validate = false
      if (this.validate) {
        this.estimateTx()
      }
    },

    async senderConvert() {
      const txData = this.makeTxData()
      console.log(txData)

      if (this.isAutoTransaction) {
        try {

          await this.$store.dispatch('SETUP_AUTOTRANSACTIONS', {
            txData,
          type: this.txType,
          description: '',
          to: this.coinTo.value,
          coin: this.coin.value,
          amount: this.amountBig.toString(),
        })
        } catch (error) {
          this.$q.notify({
            message: this.$t(error?.response?.data?.response?.message),
          icon: 'report_problem',
          color: 'negative',
        })
        return
          }
      }

      this.$store
        .dispatch('SENDER', txData)
        .then(() => {
          this.$q.notify({
            message: this.$t('Transaction successful'),
            icon: 'tag_faces',
            color: 'teal',
          })
          this.clearAll()
          setTimeout(() => {
            this.$store.dispatch('FETCH_BALANCE').then((data) => {
              this.setDefaultCoin()
            })
          }, 2000)
        })
        .catch((error) => {
          console.log(error)
          this.$q.notify({
            message: error,
            icon: 'report_problem',
            color: 'negative',
          })
        })
    },
  },
  computed: {
    ...mapState({
      minterGate: state => state.wallet.minterGate,
      activeWalletAddress: state => state.wallet.address,
      user: state => state.user.user
    }),
    ...mapGetters([
      'balanceSelect',
      'coinsSelect',
      'balanceObj',
      'coinsInfo'
    ])
  },
  watch: {
    amount () { this.valifateForm() },
    coin () { this.valifateForm() },
    balanceSelect () {
      this.setDefaultCoin()
    },
    activeWalletAddress () {
      this.amount = null
      this.coinTo = null
    },
    coinTo () { this.valifateForm() },
    convertTab () { this.clearAll() }
  }
}
</script>
