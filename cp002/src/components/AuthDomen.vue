<template>
  <q-item>
    <q-item-section>
      <q-item-label lines="1">
        <img :src="'https://www.google.com/s2/favicons?domain=' + item.name" class="favicon-site">
        &nbsp;
        <span class="text-weight-medium">{{ item.name }}</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div class="text-grey-8">
        <q-btn @click="remove" icon="delete">Remove</q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'Login',
  props: ['item', 'name'],
  data () {
    return {
    }
  },
  methods: {
    remove () {
      let requests = {
        id: this.nonce,
        from: 'wallet',
        to: 'server',
        action: 'remove-auth',
        requests: [this.item.name]
      }
      this.$store.dispatch('REQUESTS', requests)
      this.$q.notify({
        message: 'Access to requests is closed',
        icon: 'tag_faces',
        color: 'teal'
      })
    }
  },

  computed: {
    ...mapState({
      nonce: state => state.wallet.nonce
    })
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
  .favicon-site {
    vertical-align: middle;
  }
</style>
