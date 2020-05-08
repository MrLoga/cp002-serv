<template>
  <div>
    <b v-if="value" v-html="value + ' BIP'" class="text-grey-10" />
    <q-spinner-rings v-else size="2em" />
  </div>
</template>

<script>
import { prettyNumber } from '../utils'

export default {
  name: 'BalanceValue',
  props: {
    address: String
  },
  data () {
    return {
      value: null
    }
  },
  async created () {
    const data = await this.$store.dispatch('FETCH_BALANCE_ADDRESS', this.address)
    this.value = prettyNumber(data.total_balance_sum, 2, true)
  }
}
</script>
