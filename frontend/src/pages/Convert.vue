<template>
  <q-page>
    <q-tabs
      v-model="convertTab"
      inline-label
      active-color="white"
      indicator-color="white"
      class="bg-teal text-white shadow-2"
    >
      <q-tab name="sell" :label="$t('Exchange')" />
      <q-tab name="buy" :label="$t('Get')" />
    </q-tabs>

    <q-tab-panels v-model="convertTab" animated>
      <q-tab-panel name="sell">
        <form @submit.prevent.stop="confirmConvert = true" class="q-gutter-md">
          <q-select
            outlined
            v-model="coinSymbol"
            :label="$t('Coin you have')"
            bottom-slots
            behavior="dialog"
            :display-value="coinSymbol && coinSymbol.coin ? `<b>${coinSymbol.coin}</b> (${coinSymbol.amountPretty})` : ''"
            :options="balancesSelect"
            :hint="coinSymbol && coinSymbol.coin ? coinsJSON[coinSymbol.coin].name : ''"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                   <q-avatar :style="`background-color: ${stringToHSL(scope.opt.coin)}`" class="balance__coin-avatar" text-color="white">
                    {{ scope.opt.coin.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{ scope.opt.coin }}</b> ({{ scope.opt.amountPretty }})</q-item-label>
                  <q-item-label class="one-line" caption>{{ coinsJSON[scope.opt.coin].name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model="amountString"
            type="number"
            step="any"
            outlined
            clearable
            debounce="250"
            :label="$t('Amount')"
            :rules="[
              val => (val && !!val.toString().length) || $t('Field is required'),
              val => Big(Big(coinSymbol.amount).minus(this.feeSellBase)).gte(Big(val.toString().replace(',', '.'))) || $t('Not enough') + ' ' + coinSymbol.value
            ]"
          >
            <template v-slot:after>
              <q-btn round no-caps flat label="Max" @click="maxAmountSell" />
            </template>
          </q-input>

          <div style="text-align: center;" class="q-mt-none">
            <q-icon name="arrow_downward" size="md"></q-icon>
          </div>

          <q-select
            outlined
            v-model="coinSymbolTo"
            :label="$t('Coin you want')"
            use-input
            input-debounce="250"
            behavior="dialog"
            @filter="filterFn"
            :display-value="coinSymbolTo && coinSymbolTo.value ? `<b>${coinSymbolTo.value}</b> (crr: ${coinSymbolTo.crr})` : ''"
            :options="options"
            :hint="coinSymbolTo && coinSymbolTo.value ? coinSymbolTo.name : ''"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('No results') }}
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                   <q-avatar :style="`background-color: ${stringToHSL(scope.opt.symbol)}`" class="balance__coin-avatar" text-color="white">
                    {{ scope.opt.symbol.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{ scope.opt.symbol }}</b> (crr: {{ scope.opt.crr }})</q-item-label>
                  <q-item-label class="one-line" caption>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div>
            <q-btn type="submit" color="teal" size="16px"  icon="compare_arrows" class="full-width" :disabled="!txReady" :label="$t('Exchange')" />
          </div>
          <div v-if="resultSell != 0">
            <span class="text-subtitle1">{{ $t('You will get') }}</span>&nbsp;
            <span class="text-h6">{{ pretty(resultSell, 3) }}</span>&nbsp;
            <span class="text-subtitle1">{{ coinSymbolTo.value.toUpperCase() }}</span>
          </div>
          <div class="text-negative" v-if="!txReady && txError">
            {{ txError }}
          </div>
          <!-- <div v-if="feeSell && coinSymbol && coinSymbol.value != 'BIP'" class="text-grey-7 q-mt-none">
            Transaction fee ~ {{ pretty(feeSell, 3) }} {{ coinSymbol.value.toUpperCase() }} ({{ feeSellBase }} BIP)
          </div> -->
          <div :class="`text-grey-7 ${resultSell != 0 ? 'q-mt-none': ''}`">
            {{ $t('Transaction fee') }}: {{ feeSellBase }} BIP
          </div>
        </form>
      </q-tab-panel>

      <q-tab-panel name="buy">
        <form @submit.prevent.stop="confirmConvert = true" class="q-gutter-md">
          <q-select
            outlined
            v-model="coinSymbolTo"
            :label="$t('Coin you want')"
            use-input
            input-debounce="250"
            behavior="dialog"
            @filter="filterFn"
            :display-value="coinSymbolTo && coinSymbolTo.value ? `<b>${coinSymbolTo.value}</b> (crr: ${coinSymbolTo.crr})` : ''"
            :options="options"
            :hint="coinSymbolTo && coinSymbolTo.value ? coinSymbolTo.name : ''"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{ $t('No results') }}
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                   <q-avatar :style="`background-color: ${stringToHSL(scope.opt.symbol)}`" class="balance__coin-avatar" text-color="white">
                    {{ scope.opt.symbol.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{ scope.opt.symbol }}</b> (crr: {{ scope.opt.crr }})</q-item-label>
                  <q-item-label class="one-line" caption>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model.number="amountString"
            type="number"
            outlined
            debounce="250"
            :label="$t('Amount')"
          >
          </q-input>

          <div style="text-align: center;" class="q-mt-none">
            <q-icon name="arrow_upward" size="md"></q-icon>
          </div>

          <q-select
            outlined
            v-model="coinSymbol"
            :label="$t('Coin you have')"
            bottom-slots
            behavior="dialog"
            :display-value="coinSymbol && coinSymbol.coin ? `<b>${coinSymbol.coin}</b> (${coinSymbol.amountPretty})` : ''"
            :options="balancesSelect"
            :hint="coinSymbol && coinSymbol.coin ? coinsJSON[coinSymbol.coin].name : ''"
          >
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                   <q-avatar :style="`background-color: ${stringToHSL(scope.opt.coin)}`" class="balance__coin-avatar" text-color="white">
                    {{ scope.opt.coin.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label><b>{{ scope.opt.coin }}</b> ({{ scope.opt.amountPretty }})</q-item-label>
                  <q-item-label class="one-line" caption>{{ coinsJSON[scope.opt.coin].name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div>
            <q-btn type="submit" color="teal" size="16px"  icon="compare_arrows" class="full-width" :disabled="!txReady" :label="$t('Exchange')" />
          </div>
          <div v-if="resultBuy != 0">
            <span class="text-subtitle1">{{ $t('You will pay') }}</span>&nbsp;
            <span class="text-h6">{{ pretty(resultBuy, 3) }}</span>&nbsp;
            <span class="text-subtitle1">{{ coinSymbol.value.toUpperCase() }}</span>
          </div>
          <div class="text-negative" v-if="!txReady && txError">
            {{ txError }}
          </div>
          <!-- <div v-if="feeSell && coinSymbol && coinSymbol.value != 'BIP'" class="text-grey-7 q-mt-none">
            Transaction fee ~ {{ pretty(feeSell, 3) }} {{ coinSymbol.value.toUpperCase() }} ({{ feeBuyBase }} BIP)
          </div> -->
          <div :class="`text-grey-7 ${resultBuy != 0 ? 'q-mt-none': ''}`">
            Transaction fee: {{ feeBuyBase }} BIP
          </div>
        </form>
      </q-tab-panel>
    </q-tab-panels>
    <!-- Result dialog for sell -->
    <q-dialog v-if="txReady" v-model="confirmConvert" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section style="text-align: center;">
          <div class="text-h5 text-grey-7">{{ $t('Youre Exchange') }}</div>
          <div class="text-h5">{{ numberSpaces(pretty(amount, 3)) }} <span class="text-h6">{{ coinSymbol.value }}</span></div>
          <div class="text-grey-7">{{ $t('to') }}</div>
          <div class="text-h5">{{ numberSpaces(pretty(convertTab === 'sell' ? resultSell : resultBuy, 3)) }} <span class="text-h6">{{ coinSymbolTo.value }}</span></div>
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
import { TX_TYPE_BUY, TX_TYPE_SELL } from 'minterjs-tx'
import { mapGetters, mapState } from 'vuex'
import { stringToHSL, pretty, numberSpaces } from '../utils'
import Big from 'big.js'

export default {
  name: 'Convert',
  components: {
  },
  data () {
    return {
      convertTab: 'sell',
      coinSymbol: null,
      coinSymbolTo: null,
      amountString: null,
      amount: null,
      options: [],
      confirmConvert: false,
      txReady: false,
      txError: '',
      resultBuy: 0,
      resultSell: 0,
      feeBuy: getFeeValue(TX_TYPE_BUY),
      feeBuyBase: getFeeValue(TX_TYPE_BUY),
      feeSell: getFeeValue(TX_TYPE_SELL),
      feeSellBase: getFeeValue(TX_TYPE_SELL)
    }
  },
  computed: {
    ...mapState({
      // balancesSelect: state => state.api.balancesSelect,
      coinsSelect: state => state.api.coinsSelect,
      coinsJSON: state => state.api.coinsJSON,
      minterGate: state => state.wallet.minterGate
    }),
    ...mapGetters([
      'balancesSelect'
      // 'getBlocked'
    ])
  },
  methods: {
    Big (val) { return Big(val) },
    pretty (val, l) { return pretty(val, l) },
    numberSpaces (val) { return numberSpaces(val) },
    stringToHSL: (str) => stringToHSL(str),
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.coinsSelect
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.coinsSelect.filter(v => v.symbol.toLowerCase().indexOf(needle) > -1)
      })
    },
    maxAmountSell () {
      if (!this.coinSymbol || !this.coinSymbol.value) return false
      this.amount = new Big(this.coinSymbol.amount.replace(',', '.'))
      if (this.coinSymbol.value === 'BIP') {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.')).minus(this.feeSellBase)
      } else {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.'))
      }
      this.amountString = this.amount.toString()
    },
    senderConvert () {
      const txData = {
        type: this.convertTab,
        data: {
          coinToSell: this.coinSymbol.value,
          coinToBuy: this.coinSymbolTo.value
        },
        feeCoinSymbol: 'BIP',
        message: ''
      }
      if (this.convertTab === 'buy') {
        txData.data.valueToBuy = this.amount.toString()
      } else if (this.convertTab === 'sell') {
        txData.data.valueToSell = this.amount.toString()
      }
      this.$store.dispatch('SENDER', txData).then(txHash => {
        this.$q.notify({
          message: this.$t('Transaction successful'),
          icon: 'tag_faces',
          color: 'teal'
        })
        this.$store.dispatch('FETCH_BALANCE')
        this.clearAll()
      }).catch(error => {
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative'
        })
      })
    },
    clearAll () {
      this.coinSymbol = null
      this.coinSymbolTo = null
      this.amount = null
      this.amountString = null
      this.options = []
      this.confirmConvert = false
      this.resultBuy = 0
      this.resultSell = 0
      this.txReady = false
      this.txError = ''
    },
    calcBuy () {
      this.txReady = false
      this.txError = ''
      this.resultBuy = 0
      this.resultSell = 0
      const amountTmp = this.amountString
      this.amount = Big(amountTmp ? amountTmp.toString().replace(',', '.') : 0)
      if (this.coinSymbol && this.coinSymbolTo && this.coinSymbol.value === this.coinSymbolTo.value) {
        this.txReady = false
        this.txError = this.$t('Сhoose different coins')
      } else if (this.amount && this.amount.gt(0) && this.coinSymbol && this.coinSymbol.value && this.coinSymbolTo) {
        const estimateTxAction = this.convertTab === 'buy' ? 'estimateCoinBuy' : 'estimateCoinSell'
        const estimateTx = {
          coinToSell: this.coinSymbol.value,
          coinToBuy: this.coinSymbolTo.value
        }
        if (this.convertTab === 'buy') {
          estimateTx.valueToBuy = this.amount
        } else if (this.convertTab === 'sell') {
          estimateTx.valueToSell = this.amount
        }
        this.minterGate[estimateTxAction](estimateTx).then((result) => {
          this.feeSell = result.commission
          this.resultSell = result.will_get
          this.resultBuy = result.will_pay
          this.txReady = true
          if (this.convertTab === 'buy') {
            if (Big(this.resultBuy).lte(this.coinSymbol.amount)) {
              this.txReady = true
            } else {
              this.txReady = false
              this.txError = this.$t('Not enough') + ` ${this.pretty(Big(this.resultBuy).minus(this.coinSymbol.amount), 3)} ${this.coinSymbol.value }`
            }
          }
        }).catch((error) => {
          this.txReady = false
          this.txError = error.log
        })
      } else {
        this.txReady = false
      }
    }
  },
  created () {
  },
  watch: {
    amountString (newVal) {
      this.calcBuy()
    },
    coinSymbol () {
      this.calcBuy()
    },
    coinSymbolTo () {
      this.calcBuy()
    },
    convertTab () {
      this.clearAll()
    }
  }
}
</script>
