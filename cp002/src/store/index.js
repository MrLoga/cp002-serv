import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

import app from './modules/app'
import api from './modules/api'
import wallet from './modules/wallet'
import auth from './modules/auth'
import request from './modules/request'
import push from './modules/push'
import contacts from './modules/contacts'
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
      auth,
      request,
      contacts,
      push
    },
    plugins: [createPersistedState()],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
