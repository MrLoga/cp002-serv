// import axios from 'axios'

const getDefaultState = () => {
  return {
    authDB: {}
  }
}
const state = getDefaultState()

const getters = {
  getAuthorized: state => {
    let authObj = {}
    for (let auth in state.authDB) {
      if (authObj[auth] !== 'blocked') {
        authObj[auth] = state.authDB[auth]
      }
    }
    return authObj
  },
  getBlocked: state => {
    let blockObj = {}
    for (let auth in state.authDB) {
      if (blockObj[auth] === 'blocked') {
        blockObj[auth] = state.authDB[auth]
      }
    }
    return blockObj
  }
}

const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
  },
  SAVE_AUTH: (state, payload) => {
    state.authDB[payload.domen] = {
      nonce: payload.nonce,
      name: payload.domen
    }
  },
  UPDATE_AUTH: (state, payload) => {
    let authObj = {}
    for (let auth in payload) {
      authObj[auth] = {
        nonce: payload[auth],
        name: auth
      }
    }
    state.authDB = authObj
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
