<template>
  <q-page padding>
    <form @submit.prevent.stop="registration" class="q-gutter-md q-mt-lg q-mb-lg">
      <div class="text-h5 q-mt-lg text-center">{{ $t('Registration') }}</div>
      <q-input
        v-model="username"
        outlined
        clearable
        bg-color="white"
        label="Username"
      />
      <q-input
        v-model="email"
        outlined
        clearable
        bg-color="white"
        label="Email"
      />
      <q-input
        v-model="password"
        type="password"
        outlined
        clearable
        bg-color="white"
        :label="$t('Password')"
      />
      <div>
        <q-btn type="submit" color="teal" size="16px" class="full-width">
          <!-- <q-icon left name="assignment_ind" /> -->
          {{ $t('Create account') }}
        </q-btn>
      </div>
      <div v-if="error" class="text-red-10 text-subtitle1">
        {{ error }}
      </div>
    </form>
    <div class="row justify-center">
      <div class="col-8">
        <q-btn to="/profile" flat size="16px" class="bg-light-blue-14 text-white full-width q-mt-lg">
          <!-- <q-icon left name="assignment_ind" /> -->
          {{ $t('Login') }}
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { strapiMessage } from '../../utils/error'
import { mapState } from 'vuex'
export default {
  name: 'Registration',
  data () {
    return {
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
    async registration () {
      this.error = null
      try {
        const { data } = await this.$axios.post('http://localhost:1337/auth/local/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        if (data.jwt) {
          this.$store.commit('LOGIN_USER_DATA', data)
          this.$store.dispatch('SYNC_USER_CONTACTS')
          this.$q.notify({
            message: this.$t('Transaction successful'),
            type: 'positive',
            position: 'bottom'
          })
          this.$router.push({ path: '/profile' })
        }
      } catch (error) {
        this.error = strapiMessage(error)
      }
    }
  },
  computed: {
    ...mapState({
      jwt: state => state.user.jwt
    })
  },
  watch: {
    jwt (newVal) {
      console.log(newVal)
    }
  }
}
</script>
