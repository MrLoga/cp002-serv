<template>
  <div>
    <!-- $t('Сhoose active wallet')" -->
    <div v-if="wallets && wallets.length === 1 && wallet && wallet.title">
      <b>{{ wallet.title }}</b>
    </div>
    <q-select
      v-else-if="walletsSelect && walletsSelect.length"
      v-model="wallet"
      rounded standout
      bg-color="light-blue-10"
      :dense="true"
      @input="inputChange"
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
            <!-- <BalanceValue :address="scope.opt.address" /> -->
            <!-- <b v-if="value" v-html="value + ' BIP'" class="text-grey-10" /> -->
            <b v-if="scope.opt.balance" v-html="scope.opt.balance + ' BIP'" class="text-grey-10" />
            <q-spinner-rings v-else size="2em" />
          </q-item-section>
        </q-item>
        <q-separator inset />
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'WalletSelect',
  props: {
    dense: Boolean
  },
  data () {
    return {
      wallet: null,
      value: null
    }
  },
  created () {
    if (this.walletsSelect && this.walletsSelect.length && this.address) {
      const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
      this.wallet = this.walletsSelect[currentWallet]
    } else {
      if (this.walletsSelect && this.walletsSelect.length) {
        this.$store.commit('SET_WALLET', this.walletsSelect[0].address)
      } else {
        this.$store.commit('SET_WALLET', null)
      }
    }
  },
  methods: {
    inputChange (val) {
      // if (this.wallet.address === val.address && this.$route.path !== '/wallet') {
      //   this.$router.push({ path: '/wallet' })
      // }
      if (val && val.address) {
      // if (val && val.address && val.address !== this.address) {
        this.wallet = val
        this.$store.commit('SET_WALLET', val.address)
        this.$store.dispatch('FETCH_BALANCE')
        this.$store.dispatch('FETCH_DELEGATION')
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      wallets: state => state.wallet.wallets
    }),
    ...mapGetters([
      'walletsSelect',
      'findWallet'
    ])
  },
  watch: {
    // walletsSelect (val) {
    //   const currentWallet = this.walletsSelect.findIndex(item => item.address === this.address)
    //   this.wallet = this.walletsSelect[currentWallet]
    // },
    address (val) {
      if (val) {
        const currentWallet = this.walletsSelect.findIndex(item => item.address === val)
        this.wallet = this.walletsSelect[currentWallet]
      }
    }
  }
}
</script>
