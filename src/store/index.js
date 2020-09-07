import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

import * as app from './modules/app'
import * as api from './modules/api'
import * as wallet from './modules/wallet'
import * as user from './modules/user'
// import request from './modules/request'
import * as contacts from './modules/contacts'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      api,
      wallet,
      user,
      // request,
      contacts
    },
    plugins: [createPersistedState()],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
