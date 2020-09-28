<template>
  <q-page padding>
    <q-card bordered flat>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div v-if="user" class="col">
            <div class="text-h5">{{ user.username }}</div>
            <span class="text-caption text-grey-7">{{ user.email }}</span>
          </div>
          <div v-else class="col">
            <div class="text-h5">???</div>
          </div>

          <!-- <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="logout">
                    <q-item-section>{{ $t('Logout') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div> -->
        </div>
      </q-card-section>
    </q-card>

    <div class="text-h6 q-pa-md q-mt-md">{{ $t('Subscriptions') }}</div>
    <SubscriptionItem
      :description="$t('Create a bunch of transactions that will be automaticly applied')"
      :name="$t('Auto-Transations')"
      @click:buy="triggerTariff()"
      @click:settings="openSettings('auto-transactions')"
    />
    <SubscriptionItem
      description="Sync wallets and contacts across devices and platforms"
      name="Synchronization"
      @click:buy="triggerTariff()"
      @click:settings="openSettings('sync')"
    />
    <Tarif ref="tarif" />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import SubscriptionItem from '../../components/profile/SubscriptionItem.vue'
import Tarif from '../../components/profile/Tarif.vue'

export default {
  name: 'Profile',
  components: {
    Tarif,
    SubscriptionItem,
  },
  data() {
    return {
      payTariffDialog: false,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      address: state => state.wallet.address,
      contacts: state => state.contacts.contacts,
    }),
    ...mapGetters(['isAuth', 'findWallet']),
    syncContacts: {
      get() {
        return this.$store.state.user.syncContacts
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncContacts', value])
      },
    },
    syncWallets: {
      get() {
        return this.$store.state.user.syncWallets
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncWallets', value])
      },
    },
    syncObservers: {
      get() {
        return this.$store.state.user.syncObservers
      },
      set(value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncObservers', value])
      },
    },
  },
  created() {
    if (!this.isAuth) {
      this.$router.push({ path: '/profile/login' })
    } else {
      console.log('isAuth', this.user)
    }
  },
  mounted() {},
  methods: {
    triggerTariff() {
      this.$refs.tarif.toggle()
    },
    openSettings(subPath) {
      this.$router.push({ path: `/profile/${subPath}` })
    },
    async sync() {
      this.$store.dispatch('SYNC_USER_CONTACTS')
    },
    logout() {
      this.$store.commit('LOGOUT_JWT')
      this.$router.push({ path: '/' })
    },
  },
}
</script>
