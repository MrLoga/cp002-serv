<template>
  <q-page class="flex justify-between">
    <div class="text-center full-width text-h3 text-weight-thin q-mt-lg">{{ $t('Registration') }}</div>
    <Register class="full-width q-pa-lg" />
    <div class="full-width text-center">
      <div class="text-center">{{ $t('Already have an account?') }}</div>
      <q-btn to="/start/login" flat color="primary" size="16px" class="full-width">
        {{ $t('Sign In') }}
      </q-btn>
    </div>
    <div class="full-width q-pa-lg">
      <q-btn rounded class="bg-white full-width q-mt-lg" size="1.2em" icon="keyboard_backspace" to="/start" :label="$t('Back')" />
    </div>
  </q-page>
</template>

<script>
import Register from '../../components/profile/Register.vue'
export default {
  name: 'Profile',
  components: {
    Register
  },
  created () {}
}
</script>
