import { i18n } from 'boot/i18n'

const getDefaultState = () => {
  return {
    rightMenu: false,
    language: 'en-us',
    // menu: 'footer'
    menu: 'header'
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
  },
  SET_MAIN_MENU: (state, payload) => {
    state.menu = payload
  },
  SET_LANG: (state, payload) => {
    i18n.locale = payload
    state.language = payload
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
