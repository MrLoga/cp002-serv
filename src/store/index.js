import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import * as app from './modules/app'
import * as api from './modules/api'
import * as wallet from './modules/wallet'
import * as user from './modules/user'
// import request from './modules/request'
import * as contacts from './modules/contacts'

Vue.use(Vuex)

export default (/* { ssrContext } */) => {

  const Store = new Vuex.Store({
    modules: {
      app,
      api,
      wallet,
      user,
      // request,
      contacts,
    },
    plugins: [createPersistedState()],

    strict: !!process.env.DEV,
  })

  window.store = Store

  return Store
}
