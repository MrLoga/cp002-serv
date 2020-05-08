<template>
  <div>
    <div v-if="wallets.length === 1">
      <b>{{ wallet.title }}</b>
    </div>
    <!-- $t('Сhoose active wallet')" -->
    <q-select
      v-else
      v-model="wallet"
      rounded standout
      bg-color="light-blue-10"
      :dense="true"
      class="header__wallet"
      behavior="dialog"
      :options="walletsSelect"
    >
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          v-on="scope.itemEvents"
        >
          <q-item-section top avatar class="q-ml-none">
            <q-avatar text-color="primary">
              <q-img v-if="scope.opt.icon" :src="scope.opt.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                <template v-slot:error>
                  <div class="avatar__text text-white bg-primary">{{ scope.opt.title[0] }}</div>
                </template>
              </q-img>
              <q-icon v-else name="person" color="grey" size="2rem" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" v-html="scope.opt.label"></q-item-label>
            <q-item-label caption lines="1">{{ scope.opt.caption }}</q-item-label>
          </q-item-section>
          <q-item-section side class="text-grey-10">
            <BalanceValue :address="scope.opt.address" />
          </q-item-section>
        </q-item>
        <q-separator inset />
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BalanceValue from './BalanceValue.vue'
// import { stringToHSL } from '../utils'

export default {
  name: 'WalletSelect',
  components: {
    BalanceValue
  },
  props: {
    dense: Boolean
  },
  data () {
    return {
      wallet: null
    }
  },
  created () {
    const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
    this.wallet = this.walletsSelect[currentWallet]
  },
  methods: {
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets,
      activeWallet: state => state.wallet.active
    }),
    ...mapGetters([
      'walletsSelect',
      'findWallet'
    ])
  },
  watch: {
    address (val) {
      if (val) {
        const currentWallet = this.walletsSelect.findIndex(item => item.address === val)
        this.wallet = this.walletsSelect[currentWallet]
      }
    },
    wallet (val) {
      if (val && val.address && val.address !== this.address) {
        this.wallet = val
        this.$store.commit('SET_WALLET', val.address)
        this.$store.dispatch('FETCH_BALANCE')
        this.$store.dispatch('FETCH_DELEGATION')
      }
    }
  }
}
</script>
