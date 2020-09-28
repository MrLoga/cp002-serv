<template>
  <q-page padding>
    <form class="q-pt-sm" @submit.prevent.stop="confirmSend = true">
      <div class="q-gutter-md">
        <AddressSearch v-model="address" :has-popup-address="true" />

        <BalanceSelect v-model="coin" />

        <q-input
          v-model="amount"
          bg-color="white"
          clearable
          debounce="250"
          :error="amountIsError"
          :error-message="amountErrorMsg"
          :label="$t('Amount')"
          outlined
          spellcheck="false"
          step="any"
          type="number"
        >
          <template #after>
            <q-btn flat label="Max" no-caps round @click="maxAmount" />
          </template>
        </q-input>

        <div class="text-right">
          <q-input
            v-if="isAddMessage"
            v-model="payload"
            bg-color="white"
            clearable
            :hint="`${payloadLength} / 1024`"
            :label="$t('Message')"
            outlined
            :rules="[val => payloadLength <= 1024 || 'Please use maximum 1024 characters']"
          />
          <q-btn
            v-else
            class="q-pr-none"
            color="indigo"
            dense
            flat
            :label="$t('Add message')"
            @click="isAddMessage = true"
          />
        </div>

        <div>
          <q-btn class="full-width" color="teal" :disabled="!isValid" size="16px" type="submit">
            <q-icon left name="send" />
            {{ txType === 'DELEGATE' ? $t('Delegate') : $t('Send') }}
          </q-btn>
        </div>
        <div v-if="!isValid" class="text-negative">{{ validateError }}</div>
        <!-- <div v-if="txType === 'DELEGATE'"> -->
        <div v-if="user && user.role.name === 'Paid'">
          <q-checkbox v-model="isAutoTransaction" color="teal" dense>
            {{ $t('Automatically repeat transaction') }}
            <span class="text-italic text-weight-light">
              {{ $t('(you can cancel this any time)') }}
            </span>
            <!-- {{ $t('Auto-delegate')}} -->
          </q-checkbox>
        </div>
        <div class="text-grey-7">
          {{ $t('Transaction fee') }}: {{ prettyNumber(commission, 5) }}
          {{ commissionCoin }}
        </div>
      </div>
    </form>

    <q-dialog
      v-model="confirmSend"
      full-width
      persistent
      transition-hide="scale"
      transition-show="scale"
    >
      <q-card class="dialog-min300">
        <q-card-section style="text-align: center;">
          <div class="text-h5 text-grey-7">
            {{ $t('You are') }}
            {{ txType === 'DELEGATE' ? $t('Delegate dialog') : $t('Send dialog') }}
          </div>
          <div v-if="coin && coin.value" class="text-h6">
            {{ prettyNumber(amountBig.toString(), 5) }} <b>{{ coin.value }}</b>
          </div>
        </q-card-section>

        <!-- <q-card-section v-if="profileTo && profileTo.title" class="row justify-center items-center q-pt-none"> -->
        <q-card-section class="row justify-center items-center q-pt-none">
          <q-avatar v-if="profile && profile.icon">
            <img :src="profile.icon" />
          </q-avatar>
          <q-icon
            v-else
            :name="txType === 'DELEGATE' ? 'developer_board' : 'account_circle'"
            size="xl"
            style="color: #ccc;"
          />
          <span v-if="profile && profile.title" class="q-ml-sm">
            {{ profile.title }}
            <div v-if="address && address.address" class="text-grey-7">
              {{ address.address.substr(0, 4) + '...' + address.address.substr(-4) }}
            </div>
          </span>
        </q-card-section>
        <!-- <q-card-section v-else style="word-break: break-word;">
          {{ addressTo }}
        </q-card-section> -->

        <q-separator inset />
        <q-card-actions align="around">
          <q-btn v-close-popup color="red" flat :label="$t('Cancel')" />
          <q-btn v-close-popup color="primary" flat :label="$t('Accept')" @click="sender" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE } from 'minter-js-sdk'
import { mapState, mapGetters } from 'vuex'
import Big from 'big.js'
import { checkAddress, prettyNumber } from '../utils'
import AddressSearch from '../components/AddressSearch.vue'
import BalanceSelect from '../components/BalanceSelect.vue'

export default {
  name: 'Send',
  components: {
    AddressSearch,
    BalanceSelect,
  },
  props: {
    import: Object,
  },
  data() {
    return {
      address: {
        address: null,
        profile: null,
      },

      coin: null,

      amount: null,
      amountBig: null,
      amountIsError: false,
      amountErrorMsg: null,

      isAddMessage: false,
      payload: null,
      payloadLength: 0,

      isValid: false,
      validateError: null,

      txType: 'SEND',
      confirmSend: false,
      commission: 0,
      commissionCoin: 'BIP',

      profile: null,

      isAutoTransaction: false,
    }
  },
  mounted() {
    // console.log(this.import)
    if (this.import && this.import.address !== '') {
      this.address = {
        address: this.import.address,
      }
    }
    if (this.import && this.import.coin !== '') {
      const tmpCoin = this.balanceSelect.find(item => item.value === this.import.coin)
      if (tmpCoin) this.coin = tmpCoin
    }
    if (this.import && this.import.amount && this.import.amount !== '') {
      const tmpAmount = this.import.amount.replace(' ', '').replace(',', '.')
      this.amount = tmpAmount
    }
    if (!this.coin) this.setDefaultCoin()
  },
  methods: {
    prettyNumber: (val, l) => prettyNumber(val, l),
    setDefaultCoin() {
      if (this.balanceObj.BIP && Big(this.balanceObj.BIP).gte(0)) {
        this.coin = this.balanceSelect.find(coin => coin.value === 'BIP')
      } else if (Big(this.balanceSelect[0].amount).gt(0)) {
        this.coin = this.balanceSelect[0]
      } else {
        this.coin = this.balanceSelect[1] ? this.balanceSelect[1] : this.balanceSelect[0]
      }
    },
    maxAmount() {
      this.amount = this.coin ? Big(this.coin.amount).toString() : null
    },
    clearForm() {
      this.address = {
        address: null,
      }
      this.coin = null
      this.amount = null
      this.payload = null
      this.commission = 0
      this.commissionCoin = 'BIP'
      this.isAutoTransaction = false
    },
    makeTxData() {
      const txData = {
        type: this.txType,
        data: {
          coin: this.coin.value,
        },
        payload: this.payload,
        gasCoin: this.commissionCoin,
      }
      if (this.txType === 'SEND') {
        txData.data.value = this.amountBig.toString()
        txData.data.to = this.address.address
      } else if (this.txType === 'DELEGATE') {
        txData.data.stake = this.amountBig.toString()
        txData.data.publicKey = this.address.address
      }
      return txData
    },
    async updateFee() {
      const bipFee = getFeeValue(TX_TYPE[this.txType], {
        payload: this.payload,
      })

      if (this.coin.value === 'BIP') {
        if (Big(this.coin.amount).lt(this.amountBig.plus(bipFee))) {
          this.amountBig = Big(this.coin.amount).minus(bipFee)
        }
        this.commission = bipFee
        this.commissionCoin = 'BIP'
      } else if (Big(this.balanceObj.BIP).lt(bipFee)) {
        try {
          const txData = this.makeTxData()
          txData.gasCoin = this.coin.value
          this.commissionCoin = this.coin.value
          this.commission = await this.$store.dispatch('GET_COMMISSION', txData)
          if (Big(this.coin.amount).lt(this.amountBig.plus(this.commission))) {
            // this.amount = Big(this.coin.amount).minus(this.commission).toString()
            this.amountBig = Big(this.coin.amount).minus(this.commission)
          }
          // console.log(this.amountBig.toString())
        } catch (error) {
          console.log(error)
        }
      } else {
        this.commission = bipFee
        this.commissionCoin = 'BIP'
      }
    },

    async validateForm() {
      this.amountIsError = false
      this.amountErrorMsg = null
      let validateTmp = true
      this.isValid = false
      this.validateError = null
      this.amountBig = this.amount ? Big(this.amount.replace(',', '.')) : Big(0)

      const addressType = checkAddress(this.address ? this.address.address : null)
      this.profile = this.address ? this.address.profile : null
      if (addressType === 'Mx') this.txType = 'SEND'
      if (addressType === 'Mp') this.txType = 'DELEGATE'

      if (
        this.amount &&
        (!this.coin || !(this.amountBig && this.amountBig.lte(this.coin.amount)))
      ) {
        this.amountIsError = true
        this.amountErrorMsg = `${this.$t('Not enough')} ${this.amountBig
          .minus(this.coin.amount)
          .round(5, 0)} ${this.coin.value}`
      }

      this.payloadLength = this.payload === null ? 0 : new Blob([this.payload]).size

      if (!addressType || !addressType.length) validateTmp = false
      if (!this.amount || !this.amount.length) validateTmp = false
      if (validateTmp) await this.updateFee()
      if (this.amountBig.lte(0)) validateTmp = false
      if (this.amountIsError) validateTmp = false
      if (validateTmp) this.isValid = true
    },

    async sender() {
      const txData = this.makeTxData()

      if (this.isAutoTransaction) {
        try {
          await this.$store.dispatch('SETUP_AUTOTRANSACTIONS', {
            txData,
            to: this.address.address,
            description: this.payload,
            coin: this.coin.value,
            amount: this.amount,
            type: this.txType,
          })
        } catch (error) {
          console.log(error)
          this.$q.notify({
            message: this.$t(error?.response?.data?.response?.message),
            icon: 'report_problem',
            color: 'negative',
          })
          return
        }
      }

      try {
        // await this.$store.dispatch('SENDER', txData)
        // console.log(txData)

        this.$q.notify({
          message: this.$t('Transaction successful'),
          type: 'positive',
          position: 'bottom',
        })
        setTimeout(() => {
          this.clearForm()
          if (this.txType === 'SEND') {
            this.$store.dispatch('FETCH_BALANCE').then(data => {
              this.setDefaultCoin()
            })
          } else {
            this.$store.dispatch('FETCH_DELEGATION')
          }
        }, 2000)
      } catch (error) {
        console.log(error)
        this.$q.notify({
          message: error,
          type: 'negative',
          position: 'bottom',
        })
      }
    },
  },
  computed: {
    ...mapState({
      activeWalletAddress: state => state.wallet.address,
      user: state => state.user.user,
    }),
    ...mapGetters(['balanceSelect', 'balanceObj', 'coinsInfo']),
  },
  watch: {
    balanceSelect() {
      this.setDefaultCoin()
    },
    activeWalletAddress() {
      this.amount = null
    },
    coin() {
      this.validateForm()
    },
    address() {
      this.validateForm()
    },
    amount() {
      this.validateForm()
    },
    payload() {
      this.validateForm()
    },
  },
}
// Помощь проектам, это залог успеха развития сети
</script>
