// import axios from 'axios'

const getDefaultState = () => {
  return {
    authDB: {}
  }
}
export const state = getDefaultState()

export const getters = {
  getAuthorized: state => {
    const authObj = {}
    for (const auth in state.authDB) {
      if (authObj[auth] !== 'blocked') {
        authObj[auth] = state.authDB[auth]
      }
    }
    return authObj
  },
  getBlocked: state => {
    const blockObj = {}
    for (const auth in state.authDB) {
      if (blockObj[auth] === 'blocked') {
        blockObj[auth] = state.authDB[auth]
      }
    }
    return blockObj
  }
}

export const mutations = {
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
    const authObj = {}
    for (const auth in payload) {
      authObj[auth] = {
        nonce: payload[auth],
        name: auth
      }
    }
    state.authDB = authObj
  }
}

export const actions = {}
