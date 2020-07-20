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
    contactsSync: false
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
  LOGIN_USER_DATA: (state, payload) => {
    state.jwt = payload.jwt
    state.httpConfig = {
      headers: {
        Authorization: `Bearer ${ payload.jwt }`
      }
    }
    state.user = payload.user
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
      return data
    } catch (error) {
      return strapiMessage(error)
    }
    // if (data.user) {
    //   context.commit('LOGIN_USER_DATA', data)
    // }
    // if (state.contactsSync) {
    //   context.commit('UPDATE_CONTACTS', data.user.contacts)
    // }
    // return data
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
