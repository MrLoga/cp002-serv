<template>
  <form @submit.prevent.stop="registration" class="q-mt-lg q-mb-lg">
    <div class="text-center q-mb-md">
      <q-btn flat color="primary" @click="helpDialog = true" :label="$t('Why register a profile?')" class="" icon="help" style="font-size: 0.8em;" />
    </div>
    <q-dialog v-model="helpDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 q-pa-md">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="positive" name="sync" />
            </q-item-section>
            <q-item-section>{{ $t('Sync you wallets and contacts between devices') }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon color="positive" name="settings_input_component" />
            </q-item-section>
            <q-item-section>{{ $t('Got access to the exclusive free and paid services') }}</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
    <q-input
      v-model="username"
      outlined
      clearable
      class="q-mb-md"
      bg-color="white"
      label="Username"
    />
    <q-input
      v-model="email"
      outlined
      clearable
      class="q-mb-md"
      bg-color="white"
      label="Email"
    />
    <q-input
      v-model="password"
      type="password"
      outlined
      clearable
      class="q-mb-md"
      bg-color="white"
      :label="$t('Password')"
    />
    <q-btn type="submit" color="teal" size="16px" class="full-width">
      {{ $t('Create account') }}
    </q-btn>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import { strapiMessage } from '../../utils/error'
export default {
  name: 'Registration',
  data () {
    return {
      helpDialog: false,
      loginTab: 'registration',
      username: null,
      email: null,
      password: null,
      error: null
    }
  },
  created () {},
  mounted () {},
  methods: {
    registration () {
      this.error = null
      this.$store.dispatch('REGISTER_USER', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then((data) => {
        if (!(data instanceof Error)) {
          this.$store.dispatch('SYNC_USER_CONTACTS')
          console.log(this.isLogin, this.isAuth)
          this.$router.push({ path: '/profile' })
        }
      })
    }
  },
  computed: {
    ...mapState({
      jwt: state => state.user.jwt,
      backendApi: state => state.user.backendApi
    }),
    ...mapGetters([
      'isLogin',
      'isAuth'
    ])
  },
  watch: {
    jwt (newVal) {
      console.log(newVal)
    }
  }
}
</script>
