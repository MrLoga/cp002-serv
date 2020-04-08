<template>
  <q-page>
    <q-tabs
      v-model="authTab"
      inline-label
      active-color="white"
      indicator-color="white"
      class="bg-teal text-white shadow-2"
    >
      <q-tab name="authorized" icon="accessibility_new" label="Authorized" />
      <q-tab name="blocked" icon="error" label="Blocked" />
    </q-tabs>

    <q-tab-panels v-model="authTab" animated>
      <q-tab-panel name="authorized">
        <q-list v-if="Object.keys(getAuthorized).length">
          <auth-domen v-for="item in getAuthorized" :item="item" :key="item.name"></auth-domen>
        </q-list>
        <q-item-label caption v-else>No authorized</q-item-label>
      </q-tab-panel>
      <q-tab-panel name="blocked">
        <q-list v-if="Object.keys(getBlocked).length">
          <auth-domen v-for="item in getBlocked" :item="item" :key="item.name"></auth-domen>
        </q-list>
        <q-item-label caption v-else>No blocked</q-item-label>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import AuthDomen from '../components/AuthDomen'

export default {
  name: 'Authenticator',
  components: {
    AuthDomen
  },
  data () {
    return {
      authTab: 'authorized'
    }
  },
  computed: {
    ...mapState({
      authDB: state => state.auth.authDB
    }),
    ...mapGetters([
      'getAuthorized',
      'getBlocked'
    ])
  },
  methods: {
    registerAddress () {
      this.$store.dispatch('REGISTER_ADDRESS')
    },
    getAddress () {
      this.$store.dispatch('GET_ADDRESS')
    }
  },
  created () {
  }
}
</script>
