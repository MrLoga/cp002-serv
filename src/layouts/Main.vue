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
    return {
      transitionNameEnter: 'fadeInLeft',
      transitionNameLeave: 'fadeOutRight',
      transitionMode: 'out-in'
      // transitionMode: 'in-out'
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'isAuth'
    ])
  },
  created () {
    if (!this.isLogin && !this.isAuth) {
      this.$router.push({ path: '/start' })
    } else if (!this.isLogin && this.isAuth) {
      if (this.$route.path !== '/') {
        this.$router.push({ path: '/' })
      }
    }
  },
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
