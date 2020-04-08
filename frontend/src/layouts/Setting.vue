<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn icon="arrow_back" round flat to="/" />
        <q-toolbar-title>
          Setting
        </q-toolbar-title>

        <q-btn dense size="lg" v-ripple flat round icon="menu" @click="toggleMenu" />
      </q-toolbar>
    </q-header>
    <main-menu></main-menu>

    <!-- <header-app></header-app> -->

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import MainMenu from '../components/MainMenu.vue'
export default {
  name: 'Setting',
  components: {
    'main-menu': MainMenu
  },
  data () {
    return {
    }
  },
  methods: {
    toggleMenu () {
      this.$store.commit('SET_MENU', true)
    }
  }
}
</script>
