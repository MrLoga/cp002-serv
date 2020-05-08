<template>
  <q-item v-ripple clickable @click="selectWallet(wallet.address)">
    <q-item-section top avatar class="q-ml-none">
      <q-avatar text-color="green" rounded>
        <q-icon name="check_circle" color="green" size="1rem" v-if="wallet.address === activeAddress" class="wallet__active-icon" />
        <q-img v-if="wallet.icon" :src="wallet.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
          <template v-slot:error>
            <div class="avatar__text text-white bg-primary">{{ wallet.title[0] }}</div>
          </template>
        </q-img>
        <q-icon v-else name="person" color="grey" size="2rem" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1" v-html="wallet.label"></q-item-label>
      <q-item-label caption lines="1">{{ wallet.caption }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <b v-if="value" v-html="value + ' BIP'" class="text-grey-10" />
      <q-spinner-rings v-else size="2em" />
      <!-- <BalanceValue :address="item.address" /> -->
    </q-item-section>
  </q-item>
</template>

<script>
import { prettyNumber } from '../utils'
import { mapState } from 'vuex'

export default {
  name: 'WalletItem',
  props: {
    wallet: Object
  },
  data () {
    return {
      value: null
    }
  },
  async created () {
    const data = await this.$store.dispatch('FETCH_BALANCE_ADDRESS', this.wallet.address)
    this.value = prettyNumber(data.total_balance_sum, 2, true)
  },
  methods: {
    selectWallet (address) {
      this.$store.commit('SET_WALLET', address)
      this.$store.dispatch('FETCH_BALANCE')
      this.$store.dispatch('FETCH_DELEGATION')
      this.$router.push({ path: '/wallet' })
    }
  },
  computed: {
    ...mapState({
      activeAddress: state => state.wallet.address
    })
  }
}
</script>
