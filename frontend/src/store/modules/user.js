import axios from 'axios'
import { strapiMessage } from '../../utils/error'

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
  isAuth: state => (!!state.jwt && !!state.jwt.length)
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
