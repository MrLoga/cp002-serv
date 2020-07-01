<template>
  <div>
    <div v-if="false" class="q-mt-lg text-center">
      <div class="text-h5 q-mt-lg q-mb-md">{{ $t('Sign in with') }}</div>
      <q-btn @click="authGoogle" push color="white">
        <img src="statics/google.svg" width="60px" />
      </q-btn>
      <q-btn @click="authVk" push color="white">
        VK
        <!-- <img src="statics/google.svg" width="60px" /> -->
      </q-btn>
    </div>
    <q-card flat bordered class="q-mb-lg q-mt-lg q-pa-md">
      <form @submit.prevent.stop="login" class="q-gutter-md">
        <div class="text-h5 text-center">{{ $t('Sign In') }}</div>
        <q-input
          v-model="identifier"
          outlined
          clearable
          bg-color="white"
          label="Username or email"
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
            {{ $t('Login') }}
          </q-btn>
        </div>
        <div v-if="error" class="text-red-10 text-subtitle1">
          {{ error }}
        </div>
      </form>
    </q-card>
    <div class="row justify-center">
      <div class="col-8">
        <q-btn to="/profile/reg" flat size="16px" class="bg-light-blue-14 text-white full-width q-mt-lg">
          <!-- <q-icon left name="assignment_ind" /> -->
          {{ $t('Create account') }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { strapiMessage } from '../../utils/error'
export default {
  name: 'Profile',
  data () {
    return {
      identifier: null,
      password: null,
      error: null
    }
  },
  created () {},
  mounted () {},
  methods: {
    async authGoogle () {
      console.log('/connect/google/callback')
      try {
        const data = await this.$axios.get(this.backendApi + '/connect/google')
        console.log(data)
      } catch (error) {
        console.error('REGISTRATION', strapiMessage(error))
      }
    },
    async authVk () {
      console.log('/connect/vk/callback')
      try {
        const data = await this.$axios.get(this.backendApi + '/connect/vk')
        console.log(data)
      } catch (error) {
        console.error('REGISTRATION', strapiMessage(error))
      }
    },
    async login () {
      try {
        const { data } = await this.$axios.post(this.backendApi + '/auth/local', {
          identifier: this.identifier,
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
        }
        console.log(data)
      } catch (error) {
        this.error = strapiMessage(error)
        console.error('REGISTRATION', strapiMessage(error))
      }
    }
  },
  computed: {
    ...mapState({
      backendApi: state => state.user.backendApi
    })
  }
}
</script>
