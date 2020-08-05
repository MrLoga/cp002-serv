<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col" v-if="user">
            <div class="text-h5">{{ user.username }}<span class="text-caption q-ml-lg">{{ user.email }}</span></div>
            <div class="text-caption" v-if="user.role.name === 'Paid'">
              {{ $t('Tariff ends') }} - {{ user.endTariff }}
            </div>
          </div>
          <div class="col" v-else>
            <div class="text-h5">???</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="logout">
                    <q-item-section>{{ $t('Logout') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="q-mt-md">
      <q-item-label header>{{ $t('Settings') }}</q-item-label>
      <div class="q-gutter-sm">
        <q-checkbox v-model="syncContacts" :label="$t('Sync contacts')" />
      </div>
      <div class="q-gutter-sm">
        <q-checkbox v-model="syncWallets" :label="$t('Sync wallets')" />
      </div>
      <div class="q-gutter-sm">
        <q-checkbox v-model="syncObservers" :label="$t('Sync observers')" />
      </div>
    </div>

    <div class="q-pt-lg">
      <Tarif />
    </div>

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
    return {}
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
