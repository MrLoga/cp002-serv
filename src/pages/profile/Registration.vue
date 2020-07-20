<template>
  <q-page padding class="flex justify-between">
    <div class="text-center full-width text-h3 text-weight-thin q-mt-lg">{{ $t('Registration') }}</div>
    <Register class="full-width q-pa-sm" />
    <div class="full-width text-center q-pt-md">
      <div class="text-center">{{ $t('Already have an account?') }}</div>
      <q-btn to="/profile/login" flat color="primary" size="16px" class="full-width">
        {{ $t('Sign In') }}
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import Register from '../../components/profile/Register.vue'
export default {
  name: 'Registration',
  components: {
    Register
  },
  created () {}
}
</script>
