<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container class="start__container start_animate fit">
      <div class="start__container-in fit">
        <transition
          :enter-active-class="`animated fast ${transitionNameEnter}`"
          :leave-active-class="`animated fast ${transitionNameLeave}`"
          :mode="transitionMode"
        >
          <router-view></router-view>
        </transition>
      </div>
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      transitionNameEnter: 'fadeInLeft',
      transitionNameLeave: 'fadeOutRight',
      transitionMode: 'out-in'
    }
  },
  methods: {},
  watch: {
    '$route' (to, from) {
      const tabs = ['/start/login', '/start/quick', '/start']
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
