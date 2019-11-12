<template>
  <q-page padding>
    <form @submit.prevent.stop="confirmSend = true" class="q-pa-md">
      <div class="q-gutter-md">
        <q-input
          v-model="addressTo"
          outlined
          clearable
          bottom-slots
          :hint="addressHint"
          label='Mx address or Mp public key'
          :rules="[val => !!val || 'Field is required']"
        >
          <template v-slot:after>
            <q-btn flat round icon="format_list_bulleted" class="cursor-pointer" @click="popupAddress = true" />
          </template>
        </q-input>

        <q-dialog v-model="popupAddress" full-width transition-show="scale" transition-hide="scale">
          <q-card style="height: 60vh;">
            <q-tabs
              v-model="popupAddressTab"
              inline-label
              active-color="white"
              indicator-color="white"
              class="bg-teal text-white shadow-2"
            >
              <q-tab name="addressSelectTab" icon="toll" label="Address" />
              <q-tab name="validatorsSelectTab" icon="work" label="Validators" />
            </q-tabs>

            <q-tab-panels v-model="popupAddressTab" animated>
              <q-tab-panel name="addressSelectTab">
                <div class="flex flex-center">
                  <h2>Soon</h2>
                </div>
              </q-tab-panel>
              <q-tab-panel name="validatorsSelectTab">
                <q-virtual-scroll
                  style="max-height: 50vh"
                  :items="validatorsSelect"
                  separator
                >
                  <template v-slot="{ item, index }">
                    <q-item :key="index" clickable v-ripple v-close-popup @click="addressTo = item.value">
                      <q-item-section top avatar>
                        <q-avatar v-if="item.icon">
                          <img :src="item.icon">
                        </q-avatar>
                        <q-icon v-else style="color: #ccc;" size="xl" name="developer_board" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.label }}</q-item-label>
                        <q-item-label caption lines="2">{{ item.desc }}</q-item-label>
                      </q-item-section>

                      <q-item-section side top>
                        <q-badge :label="pretty(item.part, 2)" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-dialog>

        <q-select
          outlined
          v-model="coinSymbol"
          label="Сhoose coin"
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
          v-model.number="amount"
          outlined
          label='Amount'
          :hint="'Fee ' + senderFee + ' bip'"
          :rules='[val => !!val.toString().length || "Field is required"]'
        >
          <template v-slot:after>
            <q-btn round no-caps flat label="Max" @click="maxValue" />
          </template>
        </q-input>
        <q-btn type="submit" color="teal" :disabled="!coinSymbol || !coinSymbol.coin || !addressTo || balancesJSON['BIP'] <= senderFee">
          <q-icon left name="send" />
          {{ txAction === 'DelegateTxParams' ? 'Delegate' : 'Send' }}
        </q-btn>
      </div>
    </form>

    <q-dialog v-if="coinSymbol && coinSymbol.coin && addressTo" v-model="confirmSend" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section style="text-align: center;">
          <div class="text-h5" style="color: #666;">You're {{ txAction === 'DelegateTxParams' ? 'Delegate' : 'Send' }}</div>
          <div class="text-h6">{{ numberSpaces(pretty(amount, 3)) }} <b>{{ coinSymbol.coin }}</b></div>
          <div style="color: #999;">to</div>
        </q-card-section>

        <q-card-section v-if="profileTo && profileTo.title" class="row justify-center items-center">
          <q-avatar v-if="profileTo && profileTo.icon">
            <img :src="profileTo.icon">
          </q-avatar>
          <q-icon v-else style="color: #ccc;" size="xl" name="developer_board" />
          <span class="q-ml-sm">
            {{ profileTo.title }}
            <div style="color: #999;">{{ addressTo.substr(0,4) + "..." + addressTo.substr(-4) }}</div>
          </span>
        </q-card-section>
        <q-card-section v-else style="word-break: break-word;">
          {{ addressTo }}
        </q-card-section>

        <q-separator inset />
        <q-card-actions align='around'>
          <q-btn flat label="Cancel" color="red" v-close-popup />
          <q-btn flat label="Accept" color="primary" @click="sender" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
  .one-line {
    white-space: nowrap;
    overflow: hidden;
  }
</style>

<script>
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE_SEND, TX_TYPE_DELEGATE } from 'minterjs-tx'
import { mapGetters, mapState } from 'vuex'
import Big from 'big.js'
import { stringToHSL, pretty, numberSpaces } from '../utils'

export default {
  name: 'Send',
  data () {
    return {
      confirmSend: false,
      popupAddressTab: 'validatorsSelectTab',
      popupAddress: false,
      addressData: null,
      coinOptions: null,
      coinSymbol: null,
      addressTo: '',
      addressHint: '',
      amount: 0,
      message: '',
      addressToOld: '',
      txAction: 'SendTxParams',
      loadedProfile: false,
      profileTo: null,
      senderFee: getFeeValue(TX_TYPE_SEND, { payload: '' })
    }
  },
  methods: {
    async findAdress (address) {
      if (address.substring(0, 2) === 'Mx' && address.length === 42) {
        this.txAction = 'SendTxParams'
        let profile = await this.$store.dispatch('GET_PROFILE', address)
        if (profile && profile.title) {
          this.addressHint = profile.title
          this.profileTo = {
            title: profile.title,
            icon: profile.icons.webp
          }
        } else this.profileTo = {}
      } else if (address.substring(0, 2) === 'Mp' && address.length === 66) {
        this.txAction = 'DelegateTxParams'
        const validator = this.findValidator(address)
        if (validator && validator.label) {
          this.addressHint = validator.label
          this.profileTo = {
            title: validator.label,
            icon: validator.icon
          }
        } else this.profileTo = {}
      } else {
        this.addressHint = ' '
        this.profileTo = {}
      }
    },
    sender () {
      // if (this.validateForm) {
      let txData = {
        txAction: this.txAction,
        coinSymbol: this.coinSymbol.coin,
        feeCoinSymbol: 'BIP',
        message: this.message
      }
      if (this.txAction === 'SendTxParams') {
        txData.amount = this.amount
        txData.address = this.addressTo
      } else if (this.txAction === 'DelegateTxParams') {
        txData.stake = this.amount
        txData.publicKey = this.addressTo
      }
      this.$store.dispatch('SENDER', txData).then(txHash => {
        this.$q.notify({
          message: 'Transaction successful',
          icon: 'tag_faces',
          color: 'teal'
        })
        this.clearAll()
      }).catch(error => {
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative'
        })
        // console.log(error)
      })
      // }
    },
    clearAll () {
      this.coinSymbol = ''
      this.addressTo = ''
      this.amount = 0
      this.message = ''
      this.addressToOld = ''
      this.txAction = ''
      this.totalString = ''
      this.loadedProfile = false
      this.profileTo = null
      this.senderFee = getFeeValue(TX_TYPE_SEND, { payload: '' })
    },
    pretty (val, l) { return pretty(val, l) },
    numberSpaces (val) { return numberSpaces(val) },
    stringToHSL: (str) => stringToHSL(str),
    // maxValue () { this.amount = parseFloat(this.balancesList[this.coinSymbol.coin]) }
    maxValue () {
      if (!this.coinSymbol || !this.coinSymbol.coin) return false
      if (this.coinSymbol.coin === 'BIP') {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.')).minus(this.senderFee)
      } else {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.'))
      }
    },
    updateFee () {
      this.senderFee = getFeeValue(this.txAction === 'SendTxParams' ? TX_TYPE_SEND : TX_TYPE_DELEGATE, { payload: this.message })
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      coinsJSON: state => state.api.coinsJSON,
      balances: state => state.api.balances,
      balancesJSON: state => state.api.balancesJSON,
      validatorsSelect: state => state.api.validatorsSelect,
      balancesSelect: state => state.api.balancesSelect
    }),
    ...mapGetters([
      'isLogin',
      'findValidator'
    ])
  },
  created () {
  },
  mounted () {},
  watch: {
    // balancesList(){ console.log(this.balancesList) },
    txAction () { this.updateFee() },
    addressTo (newVal, oldVal) {
      if (newVal === null) this.addressHint = ''
      else this.findAdress(this.addressTo)
    },
    // amount (newVal) { this.amount = newVal }
    message () { this.updateFee() }
  }
}
</script>
