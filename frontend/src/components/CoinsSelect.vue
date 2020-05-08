<template>
  <q-select
    outlined
    v-model="coin"
    :label="$t('Coin you want')"
    use-input
    spellcheck="false"
    input-debounce="250"
    bg-color="white"
    behavior="dialog"
    @filter="filterFn"
    :options="options"
    :hint="coin ? coinsInfo[coin.value].name : ''"
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
           <q-avatar :style="`background-color: ${stringToHSL(scope.opt.value)}`" class="balance__coin-avatar" text-color="white">
            <span class="balance__coin-letter">{{ scope.opt.value.charAt(0).toUpperCase() }}</span>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label><b>{{ scope.opt.value }}</b> (crr: {{ scope.opt.crr }})</q-item-label>
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
  name: 'CoinsSelect',
  props: {
    value: Object
  },
  data () {
    return {
      coin: this.value,
      options: []
    }
  },
  created () {
    this.options = this.coinsSelect
  },
  methods: {
    handleInput () {
      this.$emit('input', this.coin)
    },
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
        this.options = this.coinsSelect.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
        document.querySelector('.q-select__dialog .scroll').scrollTop = 0
      })
    }
  },
  computed: {
    ...mapGetters([
      'coinsSelect',
      'coinsInfo'
    ])
  },
  watch: {
    coin () { this.handleInput() },
    value (val) { this.coin = val }
  }
}
</script>
