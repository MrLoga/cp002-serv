// import axios from 'axios'

const getDefaultState = () => {
  return {
    rightMenu: false
  }
}
const state = getDefaultState()

const getters = {
  // isLogin: state => (!!state.address && !!state.address.length),
}

const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
  },
  SET_MENU: (state, payload) => {
    state.rightMenu = payload
  }
}

const actions = {
  // s
}

export default {
  state,
  getters,
  mutations,
  actions
}
