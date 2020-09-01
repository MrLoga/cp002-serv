<template>
  <form @submit.prevent.stop="login" class="">
    <q-input
      v-model="identifier"
      outlined
      clearable
      class="q-mb-md"
      bg-color="white"
      label="Username or email"
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
      <!-- <q-icon left name="assignment_ind" /> -->
      {{ $t('Login') }}
    </q-btn>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
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
        const data = await this.$axios.get(this.backendApi + 'connect/google')
        console.log(data)
      } catch (error) {
        console.error('REGISTRATION', strapiMessage(error))
      }
    },
    async authVk () {
      console.log('/connect/vk/callback')
      try {
        const data = await this.$axios.get(this.backendApi + 'connect/vk')
        console.log(data)
      } catch (error) {
        console.error('REGISTRATION', strapiMessage(error))
      }
    },
    login () {
      this.error = null
      this.$store.dispatch('LOGIN_USER', {
        identifier: this.identifier,
        password: this.password
      }).then(data => {
        if (!(data instanceof Error)) {
          if (data.user.role.name === 'Paid') {
            this.$store.dispatch('SYNC_USER_CONTACTS').then(sync => {
              if (this.$route.fullPath !== '/profile') {
                this.$router.push({ path: '/profile' })
              }
            })
          } else {
            if (this.$route.fullPath !== '/profile') {
              this.$router.push({ path: '/profile' })
            }
          }
        }
      })
    }
  },
  computed: {
    ...mapState({
      backendApi: state => state.user.backendApi
    }),
    ...mapGetters([
      'isLogin',
      'isAuth'
    ])
  }
}
</script>
