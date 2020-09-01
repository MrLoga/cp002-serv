<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col" v-if="user">
            <div class="text-h5">{{ user.username }}</div>
            <span class="text-caption text-grey-7">{{ user.email }}</span>
          </div>
          <div class="col" v-else>
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

    <div class="text-h6 q-pl-md q-pb-xs q-mt-lg">
      {{ $t('Settings') }}
      <span class="text-caption q-ml-md text-grey-7" v-if="user && user.role.name !== 'Paid'">Disabled</span>
    </div>
    <q-card flat bordered>
      <q-card-section>
        <div class="q-gutter-sm">
          <q-checkbox :disable="user && user.role.name !== 'Paid'" v-model="syncContacts" :label="$t('Sync contacts')" />
        </div>
        <div class="q-gutter-sm">
          <q-checkbox :disable="user && user.role.name !== 'Paid'" v-model="syncWallets" :label="$t('Sync wallets')" />
        </div>
        <div class="q-gutter-sm">
          <q-checkbox :disable="user && user.role.name !== 'Paid'" v-model="syncObservers" :label="$t('Sync observers')" />
        </div>
      </q-card-section>
    </q-card>

    <div class="text-h6 q-pa-md q-mt-md">{{ $t('Subscriptions') }}</div>
    <q-card flat bordered v-if="user">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col-9">
            <div class="text-subtitle2">
              {{ $t('Synchronization') }}
              <q-icon v-if="user && user.role.name === 'Paid'" color="positive" size="xs" name="done" />
            </div>
            <div class="text-caption q-pt-sm">{{ $t('Sync wallets and contacts across devices and platforms') }}</div>
          </div>

          <div class="col" v-if="user.role.name !== 'Paid'">
            <q-btn class="bg-light-blue-14 text-white full-width" dense size="0.9em" :label="$t('Buy')" @click="payTariffDialog = true" />
            <div class="text-caption text-center q-pt-sm">{{ $t('from') }} 0.75$</div>
          </div>
          <div class="col" v-else>
            <q-btn class="text-white full-width" color="positive" dense size="0.9em" :label="$t('Renew')" @click="payTariffDialog = true" />
            <div class="text-caption text-center q-pt-sm">{{ $t('Tariff ends') }}<br>{{ user.endTariff }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <Tarif v-bind:rootDialog="payTariffDialog" v-on:update:rootDialog="payTariffDialog = $event" />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Tarif from '../../components/Profile/Tarif.vue'
export default {
  name: 'Profile',
  components: {
    Tarif
  },
  data () {
    return {
      payTariffDialog: false
    }
  },
  created () {
    if (!this.isAuth) {
      this.$router.push({ path: '/profile/login' })
    } else {
      console.log('isAuth', this.user)
    }
  },
  mounted () {},
  methods: {
    async sync () {
      this.$store.dispatch('SYNC_USER_CONTACTS')
    },
    logout () {
      this.$store.commit('LOGOUT_JWT')
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
      address: state => state.wallet.address,
      contacts: state => state.contacts.contacts
    }),
    ...mapGetters([
      'isAuth',
      'findWallet'
    ]),
    syncContacts: {
      get () { return this.$store.state.user.syncContacts },
      set (value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncContacts', value])
      }
    },
    syncWallets: {
      get () { return this.$store.state.user.syncWallets },
      set (value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncWallets', value])
      }
    },
    syncObservers: {
      get () { return this.$store.state.user.syncObservers },
      set (value) {
        this.$store.commit('SET_SYNC_SETTINGS', ['syncObservers', value])
      }
    }
  }
}
</script>
