<template>
  <q-page>
    <q-tabs
      v-model="balanceTab"
      inline-label
      active-color="white"
      indicator-color="white"
      class="bg-teal text-white shadow-2"
    >
      <q-tab name="balance" icon="toll" :label="$t('Balance')" />
      <q-tab name="delegations" icon="work" :label="$t('Delegations')" />
    </q-tabs>

    <q-tab-panels v-model="balanceTab" animated>
      <q-tab-panel name="balance">
        <q-list class="balance">
          <q-item v-for="(amount, coin) in balancesJSON" :key="coin">
            <q-item-section avatar>
              <q-avatar :style="`background-color: ${stringToHSL(coin)}`" class="balance__coin-avatar" text-color="white">
                {{ coin.charAt(0).toUpperCase() }}{{ coin.charAt(1).toLowerCase() }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <b>{{ coin }}</b>
              </q-item-label>
              <q-item-label v-if="coinsJSON" caption lines="1">{{ coinsJSON[coin].name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              {{ amount }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="delegations">
        <q-list class="delegations" v-if="delegations.length">
          <q-item v-for="item in delegations" :key="item.pub_key + item.coin">
            <q-item-section avatar>
              <q-avatar>
                <img :src="item.validator_meta.icon_url">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <b>{{ item.coin }}</b>
              </q-item-label>
              <q-item-label caption lines="1">{{ item.validator_meta.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              {{ numberSpaces(pretty(item.value, 5)) }}
            </q-item-section>
          </q-item>
        </q-list>
        <q-item-label v-else header>{{ $t('No delegations') }}</q-item-label>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style lang="stylus">
  .balance {
    padding: 1em 0;
    &__coin-avatar {
      color: #fff;
      letter-spacing: 0;
      font-weight: 500;
    }
  }
</style>

<script>
import { mapGetters, mapState } from 'vuex'
import { stringToHSL, pretty, numberSpaces } from '../utils'
export default {
  name: 'Wallet',
  data () {
    return {
      balanceTab: 'balance'
    }
  },
  computed: {
    ...mapState({
      balances: state => state.api.balances,
      delegations: state => state.api.delegations,
      balancesJSON: state => state.api.balancesJSON,
      coinsJSON: state => state.api.coinsJSON
    }),
    ...mapGetters([
      'isLogin',
      'balanceSum',
      'balanceCustom',
      'delegationsSum'
    ])
  },
  methods: {
    numberSpaces: (val) => numberSpaces(val),
    pretty: (val, l) => pretty(val, l),
    coinLetter: (str) => str.charAt(0).toUpperCase(),
    stringToHSL: (str) => stringToHSL(str)
  },
  created () {
    // let x = this.$store.dispatch('GET_COINS')
    // console.log(x)
  }
}
</script>
