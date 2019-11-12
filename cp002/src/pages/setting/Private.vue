<template>
  <q-page padding>
    <!-- <q-btn align="left" flat to="/setting" color="primary" label="Back to setting" icon="arrow_back" /> -->

    <div class="text-h5 gray" style="margin-top: 0.5em">Keep it secret</div>
    <q-card class="mnemonic__card">
      <q-card-section>
        <div class="text-h6 ">{{ mnemonic }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn @click="copyMnemonic" flat>Copy phrase</q-btn>
      </q-card-actions>
    </q-card>
    <p>Save this seed phrase in case you plan to use this address in the future.</p>
  </q-page>
</template>

<style lang="stylus">
  .gray {
    color: #555;
  }
  .mnemonic__card {
    margin: 1em 0 2em;
  }
</style>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Setting_Private',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      mnemonic: state => state.wallet.mnemonic
    })
  },
  methods: {
    copyMnemonic () {
      navigator.clipboard.writeText(this.mnemonic).then(() => {
        this.$q.notify({
          message: 'Seed phrase copied',
          color: 'purple'
        })
      }).catch(() => {})
    }
  },
  created () {
  }
}
</script>
