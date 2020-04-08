<template>
  <q-page class="flex flex-center">
    <q-input
      class='col-8'
      v-model="mnemonic"
      outlined
      autogrow
    />
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      mnemonic: ''
    }
  }
}
</script>
