<template>
  <q-layout view="hHh lpR fFf">

    <header-app></header-app>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import HeaderApp from '../components/HeaderApp.vue'
export default {
  name: 'Setting',
  components: {
    'header-app': HeaderApp
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
