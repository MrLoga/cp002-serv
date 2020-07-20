<template>
  <q-page class="flex justify-between">
    <div class="text-center full-width text-h3 text-weight-thin q-mt-lg">{{ $t('Sign In') }}</div>
    <Login class="full-width q-pa-lg" />
    <div class="full-width text-center">
      <div class="text-subtitle2">{{ $t('New user?') }}</div>
      <q-btn to="/start/reg" flat color="primary" size="16px" class="full-width">
        {{ $t('Create account') }}
      </q-btn>
    </div>
    <div class="full-width q-pa-lg">
      <q-btn rounded class="bg-white full-width q-mt-lg" size="1.2em" icon="keyboard_backspace" to="/start" :label="$t('Back')" />
    </div>
  </q-page>
</template>

<script>
import Login from '../../components/profile/Login.vue'
export default {
  name: 'Profile',
  components: {
    Login
  },
  created () {}
}
</script>
