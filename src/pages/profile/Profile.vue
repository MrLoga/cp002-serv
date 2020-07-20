<template>
  <q-page padding>
    <q-card flat bordered class="">
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

  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  created () {
    if (!this.isAuth) {
      this.$router.push({ path: '/profile/login' })
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
      contacts: state => state.contacts.contacts
    }),
    ...mapGetters([
      'isAuth'
    ])
    // syncContacts: {
    //   get () {
    //     return this.$store.state.user.contactsSync
    //   },
    //   set (value) {
    //     this.$store.commit('SET_SYNC', value)
    //   }
    // }
  },
  watch: {
    jwt (newVal) {
      console.log(newVal)
    }
  }
}
</script>
