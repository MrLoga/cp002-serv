<template>
  <q-page padding>
    <form ref="sendForm" @submit.prevent.stop="confirmSend = true">
      <div class="q-gutter-md q-pa-md">
        <q-input
          v-model="addressTo"
          outlined
          clearable
          bottom-slots
          :label="$t('Mx address or Mp public key')"
        >
          <template v-slot:hint>
            <div class="text-overflow">{{ addressHint }}</div>
          </template>
          <template v-slot:after v-if="!isHello">
            <q-btn flat round icon="format_list_bulleted" class="cursor-pointer" @click="popupAddress = true" />
          </template>
          <template v-slot:default v-if="addressTo && addressProfilesShow">
            <q-virtual-scroll
              style="max-height: 300px;"
              :items="contactsFilter"
              separator
              class="contacts__filter"
            >
              <template v-slot="{ item, index }">
                <q-item :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.address">
                  <q-item-section top avatar class="q-ml-none">
                    <q-avatar text-color="primary">
                      <q-img v-if="item.icon" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                        <template v-slot:error>
                          <div class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                        </template>
                      </q-img>
                      <div v-else class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                    <q-item-label caption lines="1">{{ item.address }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
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
              <q-tab name="addressSelectTab" icon="supervisor_account" :label="$t('Contacts')" />
              <q-tab name="validatorsSelectTab" icon="work" :label="$t('Validators')" />
            </q-tabs>

            <q-tab-panels v-model="popupAddressTab" animated>
              <q-tab-panel name="addressSelectTab">
                <q-virtual-scroll
                  v-if="contacts && contacts.length > 0"
                  style="max-height: 50vh"
                  :items="contacts"
                  separator
                >
                  <template v-slot="{ item, index }">
                    <q-item :key="index" clickable v-ripple v-close-popup @click="addressTo = item.address">
                      <q-item-section top avatar class="q-ml-none">
                        <q-avatar color="primary" text-color="white">
                          {{ item.title[0] }}
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.title }}</q-item-label>
                        <q-item-label caption lines="1">{{ item.address }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
                <div v-else class="flex flex-center">
                  <div class="self-center text-h5 text-center">
                    {{ $t('You dont have any saved contacts') }}<br>
                    <q-btn class="q-mt-lg" to="/contacts" color="primary" :label="$t('Add first contact')" />
                  </div>
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
                      <q-item-section top avatar class="q-ml-none">
                        <q-avatar text-color="primary">
                          <q-img v-if="item.icon" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                            <template v-slot:error>
                              <div class="avatar__text text-white bg-primary">{{ item.label[0] }}</div>
                            </template>
                          </q-img>
                          <div v-else class="avatar__text text-white bg-primary">{{ item.label[0] }}</div>
                        </q-avatar>
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
          :label="$t('Сhoose coin')"
          bottom-slots
          behavior="dialog"
          :display-value="coinSymbol && coinSymbol.coin ? `<b>${coinSymbol.coin}</b> (${coinSymbol.amountPretty})` : ''"
          :options="!isHello ? balancesSelect : pushBalancesSelect"
          :hint="coinSymbol ? coinsJSON[coinSymbol.coin].name : ''"
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
          ref="amountStringEl"
          debounce="250"
          :label="$t('Amount')"
          :error="amountIsError"
          :error-message="amountErrorMsg"
        >
          <template v-slot:after>
            <q-btn round no-caps flat label="Max" @click="maxAmountSend" />
          </template>
        </q-input>
        <div>
          <q-btn type="submit" color="teal" size="16px"  class="full-width" :disabled="!txReady">
            <q-icon left name="send" />
            {{ txAction === 'delegate' ? $t('Delegate') : $t('formSend') }}
          </q-btn>
        </div>
        <div class="text-negative" v-if="amountString && !txReady && txError">
          {{ txError }}
        </div>
        <div class="text-grey-7">
          {{ $t('Transaction fee') }}: {{ senderFee }} BIP
        </div>
      </div>
    </form>

    <q-dialog v-if="coinSymbol && coinSymbol.coin && addressTo" v-model="confirmSend" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card style="max-width: 440px !important">
        <q-card-section style="text-align: center;">
          <div class="text-h5 text-grey-7">{{ $t('You are') }} {{ txAction === 'delegate' ? $t('Delegate dialog') : $t('Send dialog') }}</div>
          <div class="text-h6">{{ numberSpaces(pretty(amount, 3)) }} <b>{{ coinSymbol.coin }}</b></div>
        </q-card-section>

        <!-- <q-card-section v-if="profileTo && profileTo.title" class="row justify-center items-center q-pt-none"> -->
        <q-card-section class="row justify-center items-center q-pt-none">
          <q-avatar v-if="profileTo && profileTo.icon">
            <img :src="profileTo.icon">
          </q-avatar>
          <q-icon v-else style="color: #ccc;" size="xl" :name="txAction === 'delegate' ? 'developer_board' : 'account_circle'" />
          <span class="q-ml-sm" v-if="profileTo && profileTo.title">
            {{ profileTo.title }}
            <div class="text-grey-7">{{ addressTo.substr(0,4) + "..." + addressTo.substr(-4) }}</div>
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
import { stringToHSL, pretty, numberSpaces } from '../utils'
import Big from 'big.js'

export default {
  name: 'Send',
  props: {
    routeAddressTo: String,
    sendTxData: Object
  },
  data () {
    return {
      amountIsError: false,
      amountErrorMsg: null,
      formValid: false,
      isHello: false,
      confirmSend: false,
      popupAddressTab: 'addressSelectTab',
      popupAddress: false,
      addressData: null,
      coinOptions: null,
      coinSymbol: null,
      addressTo: '',
      addressHint: '',
      txReady: false,
      txError: '',
      amountString: null,
      amount: null,
      message: '',
      addressToOld: '',
      txAction: 'send',
      loadedProfile: false,
      profileTo: null,
      contactsFilter: null,
      addressProfilesShow: false,
      senderFee: getFeeValue(TX_TYPE_SEND, { payload: '' })
    }
  },
  methods: {
    Big (val) { return Big(val) },
    async findAddress (address) {
      if (address.substring(0, 2) === 'Mx' && address.length === 42) {
        this.txAction = 'send'
        const contact = this.findContact(address)
        if (contact && contact.title && contact.title !== '') {
          this.addressHint = contact.title
          this.profileTo = {
            title: contact.title,
            icon: null
          }
        } else {
          const profile = await this.$store.dispatch('GET_PROFILE', address)
          if (profile && profile.title) {
            this.addressHint = profile.title
            this.profileTo = {
              title: profile.title,
              icon: profile.icon
            }
          } else this.profileTo = {}
        }
      } else if (address.substring(0, 2) === 'Mp' && address.length === 66) {
        this.txAction = 'delegate'
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
      const txData = {
        type: this.txAction,
        data: {
          // to: this.sendAddress,
          // value: Big(this.amount).toString(),
          coin: this.coinSymbol.coin
        },
        gasCoin: 'BIP'
      }
      if (this.txAction === 'send') {
        txData.data.value = Big(this.amount).toString()
        txData.data.to = this.addressTo
      } else if (this.txAction === 'delegate') {
        txData.data.stake = Big(this.amount).toString()
        txData.data.publicKey = this.addressTo
      }
      this.$store.dispatch('SENDER', txData).then(txHash => {
        this.$q.notify({
          message: this.$t('Transaction successful'),
          icon: 'tag_faces',
          color: 'teal',
          position: 'bottom'
        })
        this.$store.dispatch('FETCH_BALANCE')
        this.$store.dispatch('FETCH_DELEGATION')
        this.clearAll()
      }).catch(error => {
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative',
          position: 'bottom'
        })
      })
    },
    clearAll () {
      this.coinSymbol = null
      this.addressTo = null
      this.amount = null
      this.message = ''
      this.addressToOld = ''
      this.txReady = false
      this.txError = ''
      this.txAction = ''
      this.totalString = ''
      this.loadedProfile = false
      this.profileTo = null
      this.senderFee = getFeeValue(TX_TYPE_SEND, { payload: '' })
    },
    pretty (val, l) { return pretty(val, l) },
    numberSpaces (val) { return numberSpaces(val) },
    stringToHSL: (str) => stringToHSL(str),
    checkBalance (val) {
      if (this.coinSymbol.value === 'BIP') {
        return Big(Big(this.coinSymbol.amount).minus(this.senderFee)).gte(Big(val.toString().replace(',', '.')))
      } else {
        return Big(this.coinSymbol.amount).gte(Big(val.toString().replace(',', '.')))
      }
    },
    maxAmountSend () {
      if (!this.coinSymbol || !this.coinSymbol.value) return false
      if (this.coinSymbol.value === 'BIP') {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.')).minus(this.senderFee)
      } else {
        this.amount = new Big(this.coinSymbol.amount.replace(',', '.'))
      }
      this.amountString = this.amount.toString()
    },
    updateFee () {
      this.senderFee = getFeeValue(this.txAction === 'send' ? TX_TYPE_SEND : TX_TYPE_DELEGATE, { payload: this.message })
    },
    checkAddress () {
      if ((this.addressTo.substring(0, 2) === 'Mx' && this.addressTo.length === 42) || (this.addressTo.substring(0, 2) === 'Mp' && this.addressTo.length === 66)) {
        return true
      } else return false
    },
    calcSend () {
      this.txReady = false
      this.txError = ''
      this.amountIsError = false
      this.amountErrorMsg = null

      this.updateFee()
      if (this.amountString && this.amountString.length) {
        this.amount = Big(this.amountString ? this.amountString.toString().replace(',', '.') : 0)
      } else {
        // this.amountIsError = true
        // this.amountErrorMsg = this.$t('Field is required')
      }
      if (this.coinSymbol && this.coinSymbol.value && this.amount && this.amountString && this.checkAddress()) {
        if (this.checkBalance(this.amountString)) this.txReady = true
      }
      if (this.amount && this.coinSymbol && this.amount.gte(this.coinSymbol.amount)) {
        this.amountIsError = true
        this.amountErrorMsg = this.$t('Not enough') + ` ${this.pretty(this.amount.minus(this.coinSymbol.amount), 3)} ${this.coinSymbol.value }`
        // this.txError = this.$t('Not enough') + ` ${this.pretty(this.amount.minus(this.coinSymbol.amount), 3)} ${this.coinSymbol.value }`
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      coinsJSON: state => state.api.coinsJSON,
      balances: state => state.api.balances,
      pushBalances: state => state.push.balances,
      balancesJSON: state => state.api.balancesJSON,
      validators: state => state.api.validators,
      validatorsSelect: state => state.api.validatorsSelect,
      contacts: state => state.contacts.contacts,
      profiles: state => state.contacts.profiles
    }),
    ...mapGetters([
      'isLogin',
      'findValidator',
      'filterContacts',
      'filterProfiles',
      'filterValidator',
      'findContact',
      'findProfile',
      'balancesSelect',
      'pushBalancesSelect',
      'getBalancesSelectItem'
    ])
  },
  created () {
    if (this.$route.path === '/hello') {
      this.isHello = true
    }
    if (this.routeAddressTo && this.routeAddressTo !== '') {
      this.addressTo = this.routeAddressTo
    }
    if (this.sendTxData && (this.sendTxData.type === TX_TYPE_SEND || this.sendTxData.type === TX_TYPE_DELEGATE)) {
      this.addressTo = this.sendTxData.data.to
      this.amountString = this.sendTxData.data.value
      const sendTxCoin = this.sendTxData.data.coin
      if (this.balancesJSON && this.balancesJSON[sendTxCoin]) {
        this.coinSymbol = this.getBalancesSelectItem(sendTxCoin)
      } else {
        this.coinSymbol = { coin: sendTxCoin, amount: 0, label: sendTxCoin, value: sendTxCoin }
      }
      this.calcSend()
    }
    if (!this.coinSymbol && !this.isHello) {
      this.coinSymbol = this.balancesSelect[0]
    }
    if (!this.coinSymbol && this.isHello) {
      this.coinSymbol = this.pushBalancesSelect[0]
    }
  },
  mounted () {},
  watch: {
    txAction () { this.calcSend() },
    coinSymbol () { this.calcSend() },
    addressTo (newVal) {
      this.addressProfilesShow = false
      if (newVal === null) this.addressHint = ''
      else if (newVal.substr(0, 2) === 'Mx' || newVal.substr(0, 2) === 'Mp') {
        this.findAddress(newVal)
      } else {
        if (newVal.length > 1) {
          const filterTmp = this.filterContacts(newVal).concat(this.filterValidator(newVal)).concat(this.filterProfiles(newVal))
          this.contactsFilter = filterTmp
          // console.log(this.contactsFilter)
          if (this.contactsFilter && this.contactsFilter.length) {
            this.addressProfilesShow = true
          } else {
            this.addressProfilesShow = false
          }
        } else {
          this.addressProfilesShow = false
        }
      }
      this.calcSend()
    },
    amountString () { this.calcSend() },
    message () { this.calcSend() }
  }
}
</script>
