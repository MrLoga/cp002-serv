<template>
  <q-page>
    <div class="text-h6 q-pl-md q-pb-xs q-mt-lg">
      {{ $t('Sync Settings') }}
      <span
        v-if="user && user.role.name !== 'Paid'"
        class="text-caption q-ml-md text-grey-7"
        >Disabled</span
      >
    </div>
    <q-card flat bordered>
      <q-card-section>
        <div class="q-gutter-sm">
          <q-checkbox
            v-model="syncContacts"
            :disable="user && user.role.name !== 'Paid'"
            :label="$t('Sync contacts')"
          />
        </div>
        <div class="q-gutter-sm">
          <q-checkbox
            v-model="syncWallets"
            :disable="user && user.role.name !== 'Paid'"
            :label="$t('Sync wallets')"
          />
        </div>
        <div class="q-gutter-sm">
          <q-checkbox
            v-model="syncObservers"
            :disable="user && user.role.name !== 'Paid'"
            :label="$t('Sync observers')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: state => state.user.user,
      address: state => state.wallet.address,
      contacts: state => state.contacts.contacts
    }),
    ...mapGetters(['isAuth', 'findWallet']),
    syncContacts: {
      get() {
        return this.$store.state.user.syncContacts
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncContacts', value])
      }
    },
    syncWallets: {
      get() {
        return this.$store.state.user.syncWallets
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncWallets', value])
      }
    },
    syncObservers: {
      get() {
        return this.$store.state.user.syncObservers
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncObservers', value])
      }
    }
  }
}
</script>

<style></style>
