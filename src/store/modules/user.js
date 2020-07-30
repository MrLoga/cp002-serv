import axios from 'axios'
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
const state = getDefaultState()

const getters = {
  isAuth: state => (!!state.jwt && state.jwt.length)
}

const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
  },
  SET_DEV: state => {
    state.backendApi = 'http://localhost:1337/'
  },
  SET_TEST: state => {
    state.backendApi = 'https://dev.api.reef.mn/'
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
  }
  // UPDATE: (state, payload) => {
  //   console.log('mut', payload)
  // }
}

const actions = {
  GET_USER_PROFILE: async ({ state }, payload) => {
    try {
      const { data } = await axios.get(`${ state.backendApi }users/me`, state.httpConfig)
      console.log(data)
      return data
    } catch (error) {
      return strapiMessage(error)
    }
  },
  LOGIN_USER: async ({ state, commit }, payload) => {
    try {
      const { data } = await axios.post(state.backendApi + 'auth/local', {
        identifier: payload.identifier,
        password: payload.password
      })
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
