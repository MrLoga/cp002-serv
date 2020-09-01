<template>
  <q-page padding class="flex justify-between">
    <div class="text-center full-width text-h3 text-weight-thin q-mt-lg">{{ $t('Sign In') }}</div>
    <Login class="full-width q-pa-sm q-mt-lg" />
    <div class="full-width text-center q-mt-lg">
      <div class="text-subtitle2">{{ $t('New user?') }}</div>
      <q-btn to="/profile/reg" flat color="primary" size="16px" class="full-width">
        {{ $t('Create account') }}
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import Login from '../../components/profile/Login.vue'
export default {
  name: 'ProfileLogin',
  components: {
    Login
  },
  created () {
    // console.log(123)
  }
}
</script>
