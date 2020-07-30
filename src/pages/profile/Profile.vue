<template>
  <q-page padding>
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col" v-if="user">
            <div class="text-h5">{{ user.username }}</div>
            <div class="text-caption">{{ user.email }}</div>
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

    <div v-if="user.role.name === 'Authenticated'" class="q-pt-lg">
      <div class="text-h4 text-center q-mt-lg q-mb-md">{{ $t('Choose a tariff') }}</div>
      <div class="row justify-center">
        <div class="col-xs-8">
          <q-list separator bordered class="q-mb-md text-center">
            <q-item v-ripple clickable @click="selectTariff(1)">
              <q-item-section>
                <div class="text-h6 text-teal">1 месяц</div>
                <div class="text-subtitle1 text-caption">1000 bip</div>
              </q-item-section>
            </q-item>
            <q-item v-ripple clickable @click="selectTariff(2)">
              <q-item-section>
                <div class="text-h6 text-center text-green">3 месяца</div>
                <div class="text-subtitle1 text-caption">2700 bip</div>
              </q-item-section>
            </q-item>
            <q-item v-ripple clickable @click="selectTariff(3)">
              <q-item-section>
                <div class="text-h6 text-center text-positive">12 месяцев</div>
                <div class="text-subtitle1 text-caption">9000 bip</div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <q-dialog v-model="payTariffDialog" full-width transition-show="scale" transition-hide="scale">
        <q-card class="dialog-min300">
          <q-card-section class="text-center">
            <q-icon name="stars" size="lg" color="positive" class="q-mb-sm" />
            <div class="text-h5 q-mb-md">{{ $t('Pay for a subscription?') }}</div>
            <div class="text-subtitle1">{{ $t('Wallet') }}: <b>{{ findWallet(address).title }}</b></div>
            <div class="text-subtitle1">{{ $t('Cost') }}: <b>1000 bip</b></div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="red" flat :label="$t('Cancel')" v-close-popup />
            <q-btn color="positive" :label="$t('Pay')" @click="payTariff" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Profile',
  data () {
    return {
      payTariffDialog: false
    }
  },
  created () {
    if (!this.isAuth) {
      this.$router.push({ path: '/profile/login' })
    } else {
      console.log(this.user)
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
    },
    selectTariff (name) {
      this.payTariffDialog = true
      console.log(name)
    },
    payTariff () {
      console.log('payTariff')
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
  },
  watch: {
    jwt (newVal) {
      console.log(newVal)
    }
  }
}
</script>
