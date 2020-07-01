<template>
  <q-layout view="hHh lpR fFf">

    <HeaderApp />
    <MainMenu />

    <q-page-container>
      <transition
        :enter-active-class="`animated fast ${transitionNameEnter}`"
        :leave-active-class="`animated fast ${transitionNameLeave}`"
        :mode="transitionMode"
      >
        <router-view></router-view>
      </transition>
      <!-- <q-page-sticky position="bottom-right" :offset="[18, 36]">
        <q-btn to="/qr-code" round color="accent" icon="camera_alt" size="lg" /><br>
      </q-page-sticky> -->
    </q-page-container>

  </q-layout>
</template>

<style>
  .fast {
    animation-duration : 0.15s;
  }
</style>

<script>
import { mapGetters } from 'vuex'
import HeaderApp from '../components/HeaderApp.vue'
import MainMenu from '../components/MainMenu.vue'
export default {
  name: 'Main',
  components: {
    HeaderApp,
    MainMenu
  },
  data () {
    return {}
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'isRegistered'
    ])
  },
  created () {
  }
}
</script>
