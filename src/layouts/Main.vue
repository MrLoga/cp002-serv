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
    </q-page-container>

  </q-layout>
</template>

<style>
  .fast {
    animation-duration : 0.15s;
  }
</style>

<script>
import HeaderApp from '../components/HeaderApp.vue'
import MainMenu from '../components/MainMenu.vue'
export default {
  name: 'Main',
  components: {
    HeaderApp,
    MainMenu
  },
  data () {
    return {
      transitionNameEnter: 'fadeInLeft',
      transitionNameLeave: 'fadeOutRight',
      transitionMode: 'out-in'
    }
  },
  methods: {},
  created () {},
  computed: {},
  watch: {
    '$route' (to, from) {
      const tabs = ['/home', '/wallet', '/send', '/convert']
      let toDepth = tabs.findIndex((val) => val === to.path)
      let fromDepth = tabs.findIndex((val) => val === from.path)
      if ((toDepth === -1 && fromDepth >= 0) || (toDepth >= 0 && fromDepth === -1)) {
        this.transitionNameEnter = 'fadeIn'
        this.transitionNameLeave = 'fadeOut'
      } else {
        if (toDepth === -1 && fromDepth === -1) {
          toDepth = to.path.split('/').length
          fromDepth = from.path.split('/').length
        }
        this.transitionNameEnter = toDepth < fromDepth ? 'fadeInLeft' : 'fadeInRight'
        this.transitionNameLeave = toDepth < fromDepth ? 'fadeOutRight' : 'fadeOutLeft'
      }
      // this.transitionMode = toDepth < fromDepth ? 'out-in' : 'in-out'
    }
  }
}
</script>
