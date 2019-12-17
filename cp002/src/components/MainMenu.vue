<template>
  <q-drawer v-model="rightMenuUpd" side="right" overlay behavior="mobile" elevated>
    <q-list padding class="text-grey-8">
      <q-item v-ripple v-for="link in menu" :to="link.url" :key="link.text" clickable>
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.text }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item v-ripple v-for="link in menu2" :key="link.text" :to="link.url" clickable>
        <q-item-section avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.text }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-ripple clickable @click="logout">
        <q-item-section avatar>
          <q-icon name="exit_to_app" />
        </q-item-section>
        <q-item-section>{{ $t('Exit') }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'header-app',
  data () {
    return {
      menu: [
        { icon: 'accessibility_new', text: 'CP Authenticator', url: '/authenticator' },
        { icon: 'supervisor_account', text: this.$t('Сontact list'), url: '/contacts' }
        // { icon: 'star_border', text: 'Favourites' },
        // { icon: 'search', text: 'Saved searches' }
      ],
      menu2: [
        { icon: 'person', text: this.$t('Profile'), url: '/soon' },
        { icon: 'settings', text: this.$t('Settings'), url: '/setting' }
      ]
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address
    }),
    rightMenuUpd: {
      get () {
        return this.$store.state.app.rightMenu
      },
      set (val) {
        this.$store.commit('SET_MENU', val)
      }
    }
  },
  methods: {
    logout () {
      setTimeout(() => {
        this.$store.commit('RESET_API')
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_WALLET')
        this.$store.commit('RESET_REQUEST')

        this.$router.push({ path: '/start' })
      }, 150)
    }
  },
  created () {
  }
}
</script>
