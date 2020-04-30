<template>
  <q-select
    outlined
    v-model="coin"
    :label="$t('Сhoose coin')"
    bottom-slots
    bg-color="white"
    behavior="dialog"
    :options="balanceSelect"
    :hint="coin ? coinsInfo[coin.value].name : ''"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
           <q-avatar :style="`background-color: ${stringToHSL(scope.opt.value)}`" class="balance__coin-avatar" text-color="white">
            {{ scope.opt.value.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label v-html="scope.opt.label"></q-item-label>
          <q-item-label caption lines="1">{{ coinsInfo[scope.opt.value].name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { mapGetters } from 'vuex'
import { stringToHSL } from '../utils'

export default {
  name: 'BalanceSelect',
  props: {
    value: Object
  },
  data () {
    return {
      coin: this.value
    }
  },
  created () {},
  methods: {
    stringToHSL: (str) => stringToHSL(str),
    handleInput () {
      this.$emit('input', this.coin)
    }
  },
  computed: {
    ...mapGetters([
      'balanceSelect',
      'coinsInfo'
    ])
  },
  watch: {
    coin () { this.handleInput() },
    value (val) { this.coin = val }
  }
}
</script>
