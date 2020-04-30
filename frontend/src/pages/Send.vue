<template>
  <q-page padding>
    <form class="q-pt-sm" @submit.prevent.stop="confirmSend = true">
      <div class="q-gutter-md">

        <AddressSearch v-model="address" :hasPopupAddress="true" />

        <BalanceSelect v-model="coin" />

        <q-input
          v-model="amount"
          type="number"
          step="any"
          outlined
          clearable
          debounce="250"
          bg-color="white"
          :spellcheck="false"
          :label="$t('Amount')"
          :error="amountIsError"
          :error-message="amountErrorMsg"
        >
          <template v-slot:after>
            <q-btn round no-caps flat label="Max" @click="maxAmount" />
          </template>
        </q-input>
        <div>
          <q-btn type="submit" color="teal" size="16px" class="full-width" :disabled="!validate">
            <q-icon left name="send" />
            {{ txType === 'DELEGATE' ? $t('Delegate') : $t('Send') }}
          </q-btn>
        </div>
        <div class="text-negative" v-if="!validate">{{ validateError }}</div>
        <div class="text-grey-7">
          {{ $t('Transaction fee') }}: {{ prettyNumber(commission, 5) }} {{ commissionCoin }}
        </div>
      </div>
    </form>

    <q-dialog v-model="confirmSend" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card style="max-width: 440px !important">
        <q-card-section style="text-align: center;">
          <div class="text-h5 text-grey-7">{{ $t('You are') }} {{ txType === 'DELEGATE' ? $t('Delegate dialog') : $t('Send dialog') }}</div>
          <div class="text-h6" v-if="coin && coin.value">{{ prettyNumber(amountBig.toString(), 5) }} <b>{{ coin.value }}</b></div>
        </q-card-section>

        <!-- <q-card-section v-if="profileTo && profileTo.title" class="row justify-center items-center q-pt-none"> -->
        <q-card-section class="row justify-center items-center q-pt-none">
          <q-avatar v-if="profile && profile.icon">
            <img :src="profile.icon">
          </q-avatar>
          <q-icon v-else style="color: #ccc;" size="xl" :name="txType === 'DELEGATE' ? 'developer_board' : 'account_circle'" />
          <span class="q-ml-sm" v-if="profile && profile.title">
            {{ profile.title }}
            <div class="text-grey-7" v-if="address && address.address">{{ address.address.substr(0,4) + "..." + address.address.substr(-4) }}</div>
          </span>
        </q-card-section>
        <!-- <q-card-section v-else style="word-break: break-word;">
          {{ addressTo }}
        </q-card-section> -->

        <q-separator inset />
        <q-card-actions align='around'>
          <q-btn flat :label="$t('Cancel')" color="red" v-close-popup />
          <q-btn flat :label="$t('Accept')" color="primary" @click="sender" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { getFeeValue } from 'minterjs-util'
import { TX_TYPE } from 'minter-js-sdk'
import { mapGetters } from 'vuex'
import { checkAddress, prettyNumber } from '../utils'
import Big from 'big.js'
import AddressSearch from '../components/AddressSearch.vue'
import BalanceSelect from '../components/BalanceSelect.vue'

export default {
  name: 'Send',
  components: {
    AddressSearch,
    BalanceSelect
  },
  props: {
    import: Object
  },
  data () {
    return {
      address: {
        address: null,
        profile: null
      },

      coin: null,

      amount: null,
      amountBig: null,
      amountIsError: false,
      amountErrorMsg: null,

      payload: null,

      validate: false,
      validateError: null,

      txType: 'SEND',
      confirmSend: false,
      commission: 0,
      commissionCoin: 'BIP',

      profile: null
    }
  },
  created () {},
  mounted () {
    if (this.import && this.import.address !== '') {
      this.address = {
        address: this.import.address
      }
    }
    if (!this.coin) this.setDefaultCoin()
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
    clearForm () {
      this.address = {
        address: null
      }
      this.coin = null
      this.amount = null
      this.commission = 0
      this.commissionCoin = 'BIP'
    },
    makeTxData () {
      const txData = {
        type: this.txType,
        data: {
          coin: this.coin.value
        },
        payload: this.payload,
        gasCoin: this.commissionCoin
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
    async updateFee () {
      const bipFee = getFeeValue(TX_TYPE[this.txType], { payload: this.payload })

      if (this.coin.value === 'BIP') {
        if (Big(this.coin.amount).lt(this.amountBig.plus(bipFee))) {
          this.amountBig = Big(this.coin.amount).minus(bipFee)
        }
        this.commission = bipFee
        this.commissionCoin = 'BIP'
      } else {
        if (Big(this.balanceObj.BIP).lt(bipFee)) {
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
      }
    },

    validateForm () {
      this.amountIsError = false
      this.amountErrorMsg = null
      this.validate = true
      this.validateError = null
      this.amountBig = this.amount ? Big(this.amount.replace(',', '.')) : Big(0)

      const addressType = checkAddress(this.address ? this.address.address : null)
      this.profile = this.address ? this.address.profile : null
      if (addressType === 'Mx') this.txType = 'SEND'
      if (addressType === 'Mp') this.txType = 'DELEGATE'

      if (this.amount && (!this.coin || !(this.amountBig && this.amountBig.lte(this.coin.amount)))) {
        this.amountIsError = true
        this.amountErrorMsg = this.$t('Not enough') + ` ${ this.amountBig.minus(this.coin.amount).round(5, 0) } ${this.coin.value }`
      }

      if (!addressType || !addressType.length) this.validate = false
      if (!this.amount || !this.amount.length) this.validate = false
      if (this.amountBig.lte(0)) this.validate = false
      if (this.amountIsError) this.validate = false
      if (this.validate) this.updateFee()
    },

    sender () {
      const txData = this.makeTxData()
      this.$store.dispatch('SENDER', txData).then(txHash => {
        this.$q.notify({
          message: this.$t('Transaction successful'),
          icon: 'tag_faces',
          color: 'teal',
          position: 'bottom'
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
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative',
          position: 'bottom'
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'balanceSelect',
      'balanceObj',
      'coinsInfo'
    ])
  },
  watch: {
    coin () { this.validateForm() },
    address () { this.validateForm() },
    amount () { this.validateForm() }
  }
}
</script>
