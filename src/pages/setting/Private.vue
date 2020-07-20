<template>
  <q-page padding>
    <!-- <q-btn align="left" flat to="/setting" color="primary" label="Back to setting" icon="arrow_back" /> -->

    <div class="text-h5 grey q-mt-sm">{{ $t('Keep it secret') }}</div>
    <q-card class="mnemonic__card">
      <q-card-section>
        <div class="text-h6 ">{{ mnemonic }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn @click="copyMnemonic" flat>{{ $t('Copy phrase') }}</q-btn>
      </q-card-actions>
    </q-card>
    <p>{{ $t('Save seed phrase text') }}</p>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'

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
      copyToClipboard(this.mnemonic).then(() => {
        this.$q.notify({
          message: this.$t('Seed phrase copied'),
          color: 'purple',
          position: 'bottom'
        })
      }).catch(() => {})
    }
  },
  created () {
  }
}
</script>
