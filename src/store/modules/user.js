import axios from 'axios'
import { issueCheck } from 'minter-js-sdk'
import { strapiMessage } from '../../utils/error'
import { i18n } from '../../boot/i18n'
import { Notify } from 'quasar'

const getDefaultState = () => {
  return {
    backendApi: 'https://api.reef.mn/',
    jwt: null,
    httpConfig: null,
    user: null,
    contactsSync: false,
    // sync Settings
    syncContacts: true,
    syncWallets: true,
    syncObservers: true
  }
}

export const state = getDefaultState()

export const getters = {
  isAuth: state => (!!state.jwt && state.jwt.length)
}

export const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
    if (location.hostname === 'localhost') {
      state.backendApi = 'http://localhost:1337/'
    } else if (location.hostname === 'dev.wallet.reef.mn') {
      state.backendApi = 'https://dev.api.reef.mn/'
    }
  },
  SET_API: state => {
    if (location.hostname === 'localhost') {
      state.backendApi = 'http://localhost:1337/'
    } else if (location.hostname === 'dev.wallet.reef.mn') {
      state.backendApi = 'https://dev.api.reef.mn/'
    }
  },
  LOGIN_USER_DATA: (state, payload) => {
    state.jwt = payload.jwt
    state.httpConfig = {
      headers: {
        Authorization: `Bearer ${ payload.jwt }`
      }
    }
    state.user = payload.user
  },
  SET_USER: (state, payload) => {
    state.user = payload
  },
  SET_SYNC_SETTINGS: (state, payload) => {
    state[payload[0]] = payload[1]
  },
  SET_SYNC: (state, payload) => {
    state.contactsSync = payload
  },
  LOGOUT_JWT: (state, payload) => {
    state.jwt = null
    state.httpConfig = null
    state.user = null
  },
  SET_HELPER: (state, payload) => {
    console.log(payload)
    // state.tariff =
  }
}

export const actions = {
  GET_USER_PROFILE: async ({ state, commit }, payload) => {
    try {
      const { data } = await axios.get(`${ state.backendApi }users/me`, state.httpConfig)
      commit('SET_USER', data)
      return data
    } catch (error) {
      return strapiMessage(error)
    }
  },
  LOGIN_USER: async ({ state, commit }, payload) => {
    try {
      const { data } = await axios.post(state.backendApi + 'auth/local', { ...payload })
      console.log(data)
      if (data.jwt) {
        commit('LOGIN_USER_DATA', data)
        Notify.create({
          progress: true,
          message: i18n.t('Successful login'),
          type: 'positive',
          position: 'bottom'
        })
        return data
      }
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
      return new Error(strapiMessage(error))
    }
  },
  REGISTER_USER: async ({ state, commit }, payload) => {
    try {
      const { data } = await axios.post(state.backendApi + 'auth/local/register', {
        username: payload.username,
        email: payload.email,
        password: payload.password
      })
      console.log(data)
      if (data.jwt) {
        commit('LOGIN_USER_DATA', data)
        Notify.create({
          progress: true,
          message: i18n.t('Account created'),
          type: 'positive',
          position: 'bottom'
        })
        return data
      }
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
      return new Error(strapiMessage(error))
    }
  },
  GET_HELPER: async ({ state, commit }, payload) => {
    try {
      const { data } = await axios.get(state.backendApi + 'helper')
      // commit('SET_HELPER', data)
      return data
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
      return new Error(strapiMessage(error))
    }
  },
  PAY_TARIFF: async ({ state }, payload) => {
    try {
      const check = issueCheck({ ...payload })
      console.log(check)
      const { data } = await axios.post(state.backendApi + 'tariff-pays', { tariff: payload.tariff, check: check }, state.httpConfig)

      if (data && !data.err) {
        return data
      } else {
        throw new Error(data.err)
      }
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
      return new Error(strapiMessage(error))
    }
  }
}